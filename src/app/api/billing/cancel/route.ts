import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelSubscriptionAtProvider } from "@/lib/billing";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.userId } });
  if (!subscription) {
    return NextResponse.json({ error: "You don't have a subscription to cancel" }, { status: 400 });
  }
  if (subscription.cancelAtPeriodEnd || subscription.status === "CANCELLED") {
    return NextResponse.json({ error: "This subscription is already cancelled" }, { status: 400 });
  }

  const { ok, periodEnd } = await cancelSubscriptionAtProvider(subscription, "at_period_end");
  if (!ok) {
    return NextResponse.json(
      { error: "We couldn't cancel with the payment provider. Please try again or email support@whobela.com." },
      { status: 502 }
    );
  }

  // Write the cancellation through ourselves rather than waiting on the
  // webhook, so the dashboard reflects it on the next render. The webhook
  // stays authoritative and will overwrite this with the provider's view.
  const updated = await prisma.subscription.update({
    where: { userId: session.userId },
    data: {
      cancelAtPeriodEnd: true,
      ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
    },
  });

  return NextResponse.json({ ok: true, currentPeriodEnd: updated.currentPeriodEnd });
}
