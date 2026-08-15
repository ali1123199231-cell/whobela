import { SignJWT, importPKCS8 } from "jose";
import { getConfig, CONFIG_KEYS } from "@/lib/config";

/**
 * Firebase Cloud Messaging, for the Android app.
 *
 * Deliberately hand-rolled against the HTTP v1 API rather than pulling in
 * firebase-admin: the whole of what's needed is a service-account JWT exchanged
 * for an access token, and `jose` — already here for session tokens — signs
 * RS256 perfectly well. The SDK would add ten megabytes to the image for one
 * POST, on a host that is already tight on disk.
 *
 * Credentials live in system_config alongside the VAPID keys rather than in
 * env vars, so the deployment story stays "paste it into the database once"
 * and matches how every other integration in this codebase is configured.
 */

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

export type FcmMessage = {
  token: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

/** Outcome per token, so the caller knows which ones to stop keeping. */
export type FcmResult = "sent" | "unregistered" | "failed";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

async function getServiceAccount(): Promise<ServiceAccount | null> {
  const raw = await getConfig(CONFIG_KEYS.FCM_SERVICE_ACCOUNT_JSON);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
    return parsed;
  } catch {
    // A malformed paste shouldn't take down every notification path — the
    // caller treats null as "FCM isn't configured" and web push still runs.
    console.error("[fcm] service account JSON is not parseable");
    return null;
  }
}

export async function isFcmConfigured(): Promise<boolean> {
  return (await getServiceAccount()) !== null;
}

// Access tokens last an hour. Re-minting one per notification would add two
// round trips to every response, so it's held until just before expiry.
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(account: ServiceAccount): Promise<string | null> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  try {
    // Service account keys arrive with literal \n sequences when they've been
    // through a JSON string or an env var, and importPKCS8 rejects those.
    const pem = account.private_key.replace(/\\n/g, "\n");
    const key = await importPKCS8(pem, "RS256");

    const now = Math.floor(Date.now() / 1000);
    const assertion = await new SignJWT({ scope: SCOPE })
      .setProtectedHeader({ alg: "RS256" })
      .setIssuer(account.client_email)
      .setSubject(account.client_email)
      .setAudience(TOKEN_ENDPOINT)
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(key);

    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
    });

    if (!res.ok) {
      console.error("[fcm] token exchange failed", res.status, await res.text().catch(() => ""));
      return null;
    }

    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;

    // Five minutes of headroom, so a token never expires mid-flight.
    const ttlMs = ((json.expires_in ?? 3600) - 300) * 1000;
    cachedAccessToken = { token: json.access_token, expiresAt: Date.now() + ttlMs };
    return json.access_token;
  } catch (error) {
    console.error("[fcm] could not mint an access token", error);
    return null;
  }
}

/**
 * Delivers one notification to one device.
 *
 * Never throws. Returns "unregistered" for the two statuses FCM uses to mean
 * the token is dead — the app was uninstalled, or the registration was replaced
 * — so the caller can drop the row instead of retrying it forever.
 */
export async function sendFcmMessage(message: FcmMessage): Promise<FcmResult> {
  const account = await getServiceAccount();
  if (!account) return "failed";

  const accessToken = await getAccessToken(account);
  if (!accessToken) return "failed";

  try {
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: {
            token: message.token,
            notification: { title: message.title, body: message.body },
            // The app reads `url` on tap to decide where to land. Values must
            // be strings — FCM rejects a data payload with any other type.
            data: { url: message.url ?? "/dashboard/inbox" },
            android: {
              priority: "high",
              notification: {
                // One tag per response, matching the web service worker: a
                // shared tag makes each new notification replace the last, and
                // quietly loses the news that someone said yes.
                tag: message.tag ?? "whobela-response",
                icon: "notification_icon",
                color: "#E11D48",
              },
            },
          },
        }),
      }
    );

    if (res.ok) return "sent";

    const text = await res.text().catch(() => "");
    // 404 is UNREGISTERED; 400 with this status is a token that was never
    // valid. Anything else — 429, 503, a network blip — is likely transient
    // and the token is worth keeping.
    if (res.status === 404 || (res.status === 400 && text.includes("INVALID_ARGUMENT"))) {
      return "unregistered";
    }
    console.error("[fcm] send failed", res.status, text);
    return "failed";
  } catch (error) {
    console.error("[fcm] send threw", error);
    return "failed";
  }
}
