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

export const CONFIG_KEYS = {
  BILLING_BYPASS: "BILLING_BYPASS",

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
  SHOWCASE_USERNAME: "SHOWCASE_USERNAME",
} as const;
