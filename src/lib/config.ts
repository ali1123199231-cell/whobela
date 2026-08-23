import { prisma } from "@/lib/prisma";

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { value: string | null; expiresAt: number }>();

/**
 * Reads runtime integration config (Stripe/PayPal keys, etc.) from the
 * system_config table rather than env vars, since the user manages these
 * directly in the DB. Cached briefly to avoid a query per request.
 */
export async function getConfig(key: string): Promise<string | null> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const row = await prisma.systemConfig.findUnique({ where: { key } });
  const value = row?.value ?? null;
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function getConfigMany(keys: string[]): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};
  await Promise.all(
    keys.map(async (key) => {
      result[key] = await getConfig(key);
    })
  );
  return result;
}

/**
 * Behind the shared Caddy proxy, a Route Handler's `request.url` resolves to
 * the app's internal bind address rather than the public host, so building
 * absolute URLs (e.g. for Stripe/PayPal redirect targets) must go through
 * ROOT_DOMAIN instead — same convention as src/app/dashboard/page/page.tsx.
 */
export function getRootOrigin() {
  const rootDomain = process.env.ROOT_DOMAIN ?? "localhost:3000";
  const protocol = rootDomain.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${rootDomain}`;
}

export const CONFIG_KEYS = {
  STRIPE_SANDBOX_MODE: "STRIPE_SANDBOX_MODE",
  STRIPE_SANDBOX_SECRET_KEY: "STRIPE_SANDBOX_SECRET_KEY",
  STRIPE_SANDBOX_PUBLISHABLE_KEY: "STRIPE_SANDBOX_PUBLISHABLE_KEY",
  STRIPE_SANDBOX_WEBHOOK_SECRET: "STRIPE_SANDBOX_WEBHOOK_SECRET",
  STRIPE_SANDBOX_PRICE_ID: "STRIPE_SANDBOX_PRICE_ID",
  STRIPE_LIVE_SECRET_KEY: "STRIPE_LIVE_SECRET_KEY",
  STRIPE_LIVE_PUBLISHABLE_KEY: "STRIPE_LIVE_PUBLISHABLE_KEY",
  STRIPE_LIVE_WEBHOOK_SECRET: "STRIPE_LIVE_WEBHOOK_SECRET",
  STRIPE_LIVE_PRICE_ID: "STRIPE_LIVE_PRICE_ID",

  PAYPAL_SANDBOX_MODE: "PAYPAL_SANDBOX_MODE",
  PAYPAL_SANDBOX_CLIENT_ID: "PAYPAL_SANDBOX_CLIENT_ID",
  PAYPAL_SANDBOX_CLIENT_SECRET: "PAYPAL_SANDBOX_CLIENT_SECRET",
  PAYPAL_SANDBOX_WEBHOOK_ID: "PAYPAL_SANDBOX_WEBHOOK_ID",
  PAYPAL_SANDBOX_PLAN_ID: "PAYPAL_SANDBOX_PLAN_ID",
  PAYPAL_LIVE_CLIENT_ID: "PAYPAL_LIVE_CLIENT_ID",
  PAYPAL_LIVE_CLIENT_SECRET: "PAYPAL_LIVE_CLIENT_SECRET",
  PAYPAL_LIVE_WEBHOOK_ID: "PAYPAL_LIVE_WEBHOOK_ID",
  PAYPAL_LIVE_PLAN_ID: "PAYPAL_LIVE_PLAN_ID",

  RESEND_API_KEY: "RESEND_API_KEY",
  RESEND_FROM_EMAIL: "RESEND_FROM_EMAIL",

  // Web-push signing keys. Rotating these silently invalidates every existing
  // browser subscription, so once set they should be left alone.
  VAPID_PUBLIC_KEY: "VAPID_PUBLIC_KEY",
  VAPID_PRIVATE_KEY: "VAPID_PRIVATE_KEY",

  // The Firebase service account JSON, pasted whole, used to reach the Android
  // app through FCM. Web push and FCM are independent: either can be
  // unconfigured without disturbing the other.
  FCM_SERVICE_ACCOUNT_JSON: "FCM_SERVICE_ACCOUNT_JSON",

  // The oldest app build the API still answers, and the newest one published.
  // Set these to lock out a release that shipped broken — see /api/app/config.
  APP_MIN_VERSION_CODE: "APP_MIN_VERSION_CODE",
  APP_LATEST_VERSION_CODE: "APP_LATEST_VERSION_CODE",

  // The two Android install prompts on the web: the bar on marketing pages and
  // the card shown once a page goes live. Read through isFeatureEnabled, so an
  // absent row means on — see there for why that direction.
  APP_INSTALL_BAR_ENABLED: "APP_INSTALL_BAR_ENABLED",
  APP_INSTALL_POSTPUBLISH_ENABLED: "APP_INSTALL_POSTPUBLISH_ENABLED",
} as const;

/**
 * A kill switch, as opposed to the credential lookups above.
 *
 * Those default to off because a missing Stripe key must not be treated as a
 * working one. A feature flag is the opposite case: these two prompts are the
 * only route from the site's traffic to the Play listing, and an absent row is
 * far more likely to mean "nobody has ever written one" than "turn this off".
 * So the row's job is only to disable — set it to 0/false/off to take either
 * surface down from the database, with no deploy.
 */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  const value = await getConfig(key);
  if (value === null) return true;
  return !["0", "false", "off", "no", ""].includes(value.trim().toLowerCase());
}
