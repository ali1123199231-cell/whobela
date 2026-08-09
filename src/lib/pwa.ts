// Browser-side helpers for the installed app: service-worker registration and
// push subscription. Everything here is best-effort — none of it exists on
// older browsers or on iOS Safari outside an installed app — so each entry
// point reports failure by returning rather than throwing.

const SW_PATH = "/sw.js";

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register(SW_PATH);
  } catch {
    return null;
  }
}

// The applicationServerKey has to be raw bytes; the server stores the same key
// in the URL-safe base64 the VAPID spec uses. Returns the ArrayBuffer itself
// rather than a view — a Uint8Array is generic over ArrayBufferLike, which
// includes SharedArrayBuffer and so doesn't satisfy BufferSource.
function decodeVapidKey(base64: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) view[i] = raw.charCodeAt(i);
  return buffer;
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

export type EnableResult = "enabled" | "denied" | "unsupported" | "unconfigured" | "failed";

export async function enablePush(): Promise<EnableResult> {
  if (!isPushSupported()) return "unsupported";

  const keyRes = await fetch("/api/push/subscribe");
  const keyData = await keyRes.json().catch(() => null);
  if (!keyData?.publicKey) return "unconfigured";

  // Asked before subscribing rather than after, so a refusal costs nothing.
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";

  const registration = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  if (!registration) return "failed";

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(keyData.publicKey),
    });

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!res.ok) return "failed";
    return "enabled";
  } catch {
    return "failed";
  }
}

export async function disablePush(): Promise<void> {
  const subscription = await getExistingSubscription();
  if (!subscription) return;

  // Tell the server first: if unsubscribing locally succeeded but the delete
  // didn't, we'd keep pushing to an endpoint that no longer exists.
  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  }).catch(() => {});

  await subscription.unsubscribe().catch(() => {});
}
