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

/**
 * Whether it's worth offering push at all: the browser can do it, the user
 * hasn't already blocked us, and this device isn't subscribed already.
 *
 * Deliberately free of side effects — callers use it to decide whether to put
 * a prompt on screen, and registering a worker or touching the network just to
 * answer that would be work done on behalf of a prompt that may never show.
 */
export async function canAskForPush(): Promise<boolean> {
  if (!isPushSupported()) return false;
  if (Notification.permission === "denied") return false;
  return (await getExistingSubscription()) === null;
}

const SYNC_FLAG = "whobela.push-synced";

/**
 * Re-registers this browser's existing subscription with the server.
 *
 * The two sides can drift apart: the server drops a subscription the moment a
 * push service reports it gone (a 410 during an outage, say), but the browser
 * knows nothing about that and keeps handing back the same subscription
 * object. The UI reads the browser, so it goes on showing "on" while nothing
 * is ever delivered — the one failure mode where we actively mislead someone.
 *
 * Re-POSTing is an upsert, so this is cheap and idempotent. Once per tab
 * session is enough to heal the drift without a write on every page view.
 */
export async function ensureSubscriptionSynced(): Promise<void> {
  if (!isPushSupported()) return;
  try {
    if (window.sessionStorage.getItem(SYNC_FLAG)) return;
  } catch {
    // No sessionStorage (private mode): fall through and sync every time. A
    // spare upsert costs less than never healing.
  }

  const subscription = await getExistingSubscription();
  if (!subscription) return;

  try {
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!res.ok) return; // logged out, or a blip — try again next session
    window.sessionStorage.setItem(SYNC_FLAG, "1");
  } catch {
    // Offline. The subscription is still valid; the next visit can re-sync.
  }
}

export type EnableResult = "enabled" | "denied" | "unsupported" | "unconfigured" | "failed";

/**
 * `publicKey` lets a caller that already has the VAPID key — server-rendered
 * into the page — skip the round-trip for it. That matters beyond saving a
 * request: browsers only honour a permission request that's still tied to the
 * click that triggered it, and an intervening fetch can outlive that window.
 */
export async function enablePush(publicKey?: string | null): Promise<EnableResult> {
  if (!isPushSupported()) return "unsupported";

  let vapidPublicKey = publicKey ?? null;
  if (!vapidPublicKey) {
    const keyRes = await fetch("/api/push/subscribe");
    const keyData = await keyRes.json().catch(() => null);
    vapidPublicKey = keyData?.publicKey ?? null;
  }
  if (!vapidPublicKey) return "unconfigured";

  // Asked before subscribing rather than after, so a refusal costs nothing.
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";

  const registration = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  if (!registration) return "failed";

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(vapidPublicKey),
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
