import Stripe from "stripe";
import { getConfig, CONFIG_KEYS } from "@/lib/config";

export async function isStripeSandbox() {
  return (await getConfig(CONFIG_KEYS.STRIPE_SANDBOX_MODE)) === "true";
}

export async function getStripeClient(): Promise<Stripe | null> {
  const sandbox = await isStripeSandbox();
  const secretKey = await getConfig(
    sandbox ? CONFIG_KEYS.STRIPE_SANDBOX_SECRET_KEY : CONFIG_KEYS.STRIPE_LIVE_SECRET_KEY
  );
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

export async function getStripePublicConfig() {
  const sandbox = await isStripeSandbox();
  const publishableKey = await getConfig(
    sandbox ? CONFIG_KEYS.STRIPE_SANDBOX_PUBLISHABLE_KEY : CONFIG_KEYS.STRIPE_LIVE_PUBLISHABLE_KEY
  );
  const priceId = await getConfig(sandbox ? CONFIG_KEYS.STRIPE_SANDBOX_PRICE_ID : CONFIG_KEYS.STRIPE_LIVE_PRICE_ID);
  return { STRIPE_PUBLISHABLE_KEY: publishableKey, STRIPE_PRICE_ID: priceId };
}

export async function getStripeWebhookSecret() {
  const sandbox = await isStripeSandbox();
  return getConfig(sandbox ? CONFIG_KEYS.STRIPE_SANDBOX_WEBHOOK_SECRET : CONFIG_KEYS.STRIPE_LIVE_WEBHOOK_SECRET);
}

export async function isStripeConfigured() {
  const sandbox = await isStripeSandbox();
  const secretKey = await getConfig(
    sandbox ? CONFIG_KEYS.STRIPE_SANDBOX_SECRET_KEY : CONFIG_KEYS.STRIPE_LIVE_SECRET_KEY
  );
  const { STRIPE_PRICE_ID } = await getStripePublicConfig();
  return Boolean(secretKey && STRIPE_PRICE_ID);
}
