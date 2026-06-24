import { getConfig, CONFIG_KEYS } from "@/lib/config";

export async function isPaypalSandbox() {
  return (await getConfig(CONFIG_KEYS.PAYPAL_SANDBOX_MODE)) === "true";
}

async function getBaseUrl() {
  const sandbox = await isPaypalSandbox();
  return sandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
}

async function getCredentials() {
  const sandbox = await isPaypalSandbox();
  const clientId = await getConfig(
    sandbox ? CONFIG_KEYS.PAYPAL_SANDBOX_CLIENT_ID : CONFIG_KEYS.PAYPAL_LIVE_CLIENT_ID
  );
  const clientSecret = await getConfig(
    sandbox ? CONFIG_KEYS.PAYPAL_SANDBOX_CLIENT_SECRET : CONFIG_KEYS.PAYPAL_LIVE_CLIENT_SECRET
  );
  return { clientId, clientSecret };
}

async function getPlanId() {
  const sandbox = await isPaypalSandbox();
  return getConfig(sandbox ? CONFIG_KEYS.PAYPAL_SANDBOX_PLAN_ID : CONFIG_KEYS.PAYPAL_LIVE_PLAN_ID);
}

export async function isPaypalConfigured() {
  const { clientId, clientSecret } = await getCredentials();
  const planId = await getPlanId();
  return Boolean(clientId && clientSecret && planId);
}

async function getAccessToken() {
  const { clientId, clientSecret } = await getCredentials();
  if (!clientId || !clientSecret) return null;

  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token as string;
}

export async function createPaypalSubscription(userId: string, returnUrl: string, cancelUrl: string) {
  const planId = await getPlanId();
  const token = await getAccessToken();
  if (!planId || !token) return null;

  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: userId,
      application_context: { return_url: returnUrl, cancel_url: cancelUrl },
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const approveLink = (data.links as { rel: string; href: string }[]).find((l) => l.rel === "approve");
  return { subscriptionId: data.id as string, approveUrl: approveLink?.href };
}

export async function verifyPaypalWebhook(headers: Headers, body: unknown) {
  const sandbox = await isPaypalSandbox();
  const webhookId = await getConfig(
    sandbox ? CONFIG_KEYS.PAYPAL_SANDBOX_WEBHOOK_ID : CONFIG_KEYS.PAYPAL_LIVE_WEBHOOK_ID
  );
  const token = await getAccessToken();
  if (!webhookId || !token) return false;

  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: body,
    }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}
