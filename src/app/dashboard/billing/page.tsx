import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe";
import { isPaypalConfigured } from "@/lib/paypal";
import { isShowcaseAccount } from "@/lib/showcase";
import { isBillingBypassed } from "@/lib/date-page";
import { isSubscriptionEntitled } from "@/lib/date-page-status";
import { BillingPageClient } from "./billing-page-client";

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [subscription, stripeReady, paypalReady, isShowcase, bypassBilling] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.userId } }),
    isStripeConfigured(),
    isPaypalConfigured(),
    isShowcaseAccount(session.username),
    isBillingBypassed(),
  ]);

  return (
    <BillingPageClient
      subscription={
        subscription
          ? {
              status: subscription.status,
              provider: subscription.provider,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
              currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
              // Decided here, against the server clock: a cancelled
              // subscription whose paid period has run out should offer
              // resubscribing, and comparing dates during a Client Component
              // render would risk a hydration mismatch.
              entitled: isSubscriptionEntitled(subscription),
            }
          : null
      }
      stripeReady={stripeReady}
      paypalReady={paypalReady}
      bypassBilling={bypassBilling}
      isShowcase={isShowcase}
    />
  );
}
