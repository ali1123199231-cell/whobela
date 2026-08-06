import type { SubscriptionProvider } from "@/generated/prisma/enums";
import { getStripeClient } from "@/lib/stripe";
import { cancelPaypalSubscription, getPaypalPeriodEnd } from "@/lib/paypal";

type CancellableSubscription = {
  provider: SubscriptionProvider;
  externalSubscriptionId: string;
};

// "at_period_end" is what the Cancel button in the dashboard uses: billing
// stops but the user keeps what they already paid for, matching the refund
// policy. "immediately" is for account deletion, where there's no page left
// to keep serving.
type CancelMode = "at_period_end" | "immediately";

export type CancelResult = {
  ok: boolean;
  /** When the already-paid period runs out, if the provider told us. */
  periodEnd: Date | null;
};

export async function cancelSubscriptionAtProvider(
  subscription: CancellableSubscription,
  mode: CancelMode
): Promise<CancelResult> {
  if (subscription.provider === "STRIPE") {
    return cancelStripe(subscription.externalSubscriptionId, mode);
  }
  return cancelPaypal(subscription.externalSubscriptionId, mode);
}

async function cancelStripe(subscriptionId: string, mode: CancelMode): Promise<CancelResult> {
  const stripe = await getStripeClient();
  if (!stripe) return { ok: false, periodEnd: null };

  try {
    if (mode === "immediately") {
      await stripe.subscriptions.cancel(subscriptionId);
      return { ok: true, periodEnd: null };
    }
    const updated = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    const periodEnd = updated.items.data[0]?.current_period_end;
    return { ok: true, periodEnd: periodEnd ? new Date(periodEnd * 1000) : null };
  } catch (error) {
    // Already gone on Stripe's side — the end state we wanted, so don't block
    // the caller (a retried cancel, or deleting an account whose subscription
    // was cancelled from the Stripe dashboard).
    if (isStripeMissing(error)) return { ok: true, periodEnd: null };
    return { ok: false, periodEnd: null };
  }
}

function isStripeMissing(error: unknown) {
  const code = (error as { code?: string })?.code;
  return code === "resource_missing";
}

async function cancelPaypal(subscriptionId: string, mode: CancelMode): Promise<CancelResult> {
  // Read the period end before cancelling: once PayPal cancels the
  // subscription it stops reporting a next_billing_time.
  const periodEnd = mode === "at_period_end" ? await getPaypalPeriodEnd(subscriptionId) : null;
  const ok = await cancelPaypalSubscription(subscriptionId);
  return { ok, periodEnd };
}
