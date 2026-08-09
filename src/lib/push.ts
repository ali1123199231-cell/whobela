import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { getConfigMany, CONFIG_KEYS } from "@/lib/config";
import { SITE } from "@/lib/seo/site";

// Push services require the VAPID subject to be an https: or mailto: URL, and
// reject anything else outright. A mailto: is the one form that's valid in
// every environment — the site origin is http:// in development.
const VAPID_SUBJECT = `mailto:${SITE.email}`;

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

async function getVapid() {
  const config = await getConfigMany([CONFIG_KEYS.VAPID_PUBLIC_KEY, CONFIG_KEYS.VAPID_PRIVATE_KEY]);
  const publicKey = config[CONFIG_KEYS.VAPID_PUBLIC_KEY];
  const privateKey = config[CONFIG_KEYS.VAPID_PRIVATE_KEY];
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey };
}

/** The key the browser needs to create a subscription. Null until configured. */
export async function getVapidPublicKey(): Promise<string | null> {
  const vapid = await getVapid();
  return vapid?.publicKey ?? null;
}

export async function isPushConfigured(): Promise<boolean> {
  return (await getVapid()) !== null;
}

/**
 * Pushes to every browser a user has registered.
 *
 * Never rejects. Callers fire this off with `void` alongside the response
 * they're already committing, so a throw here would surface as an unhandled
 * rejection and take the process down over a notification that didn't send.
 *
 * Subscriptions go stale constantly — a browser profile is deleted, a phone is
 * reset, permission is revoked — and the push service reports that as 404 or
 * 410. Those are pruned on the spot, because a dead endpoint otherwise gets
 * retried on every future response forever. Any other failure is left alone:
 * it's likelier to be a transient outage than a subscription worth discarding.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  try {
    const vapid = await getVapid();
    if (!vapid) return;

    const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
    if (subscriptions.length === 0) return;

    webpush.setVapidDetails(VAPID_SUBJECT, vapid.publicKey, vapid.privateKey);
    const body = JSON.stringify(payload);

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            },
            body
          );
        } catch (error) {
          const statusCode = (error as { statusCode?: number }).statusCode;
          if (statusCode === 404 || statusCode === 410) {
            await prisma.pushSubscription
              .delete({ where: { endpoint: subscription.endpoint } })
              .catch(() => {});
          } else {
            console.error("[push] send failed", statusCode ?? error);
          }
        }
      })
    );
  } catch (error) {
    console.error("[push] could not deliver", error);
  }
}
