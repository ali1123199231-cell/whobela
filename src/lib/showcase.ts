import { getConfig, CONFIG_KEYS } from "@/lib/config";

/**
 * The one designated showcase account (no admin panel — just a username
 * pinned via system_config, same pattern as the Stripe/PayPal/Resend keys)
 * that stays live forever without a subscription, so it can be shown off or
 * used as a living "default page" reference.
 */
export async function isShowcaseAccount(username: string): Promise<boolean> {
  const showcaseUsername = await getConfig(CONFIG_KEYS.SHOWCASE_USERNAME);
  return Boolean(showcaseUsername) && showcaseUsername === username;
}
