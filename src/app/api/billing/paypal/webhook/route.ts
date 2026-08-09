import { NextResponse } from "next/server";
import { verifyPaypalWebhook } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

const ACTIVE_EVENTS = new Set(["BILLING.SUBSCRIPTION.ACTIVATED"]);
const CANCELLED_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const verified = await verifyPaypalWebhook(request.headers, body);
  if (!verified) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const eventType = body.event_type as string;
  const subscriptionId = body.resource?.id as string | undefined;
  if (!subscriptionId) return NextResponse.json({ ok: true });

  if (ACTIVE_EVENTS.has(eventType)) {
    // No Subscription row exists yet at this point — this is the first time we
    // know the subscription was actually approved, so create it here using
    // custom_id (set to the userId at creation time). Whobela no longer sells
    // subscriptions, but this webhook stays mounted so any event still in
    // flight from the paid era lands somewhere and keeps the table truthful.
    const userId = body.resource?.custom_id as string | undefined;
    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, provider: "PAYPAL", externalSubscriptionId: subscriptionId, status: "ACTIVE" },
        update: { provider: "PAYPAL", externalSubscriptionId: subscriptionId, status: "ACTIVE" },
      });
    }
  } else if (CANCELLED_EVENTS.has(eventType)) {
    // Cancelling in PayPal's own UI never touches our cancel route, so this is
    // the only chance to record what the user already paid for. PayPal usually
    // drops next_billing_time once a subscription ends — when it's missing we
    // leave currentPeriodEnd alone rather than guessing.
    const nextBilling = body.resource?.billing_info?.next_billing_time as string | undefined;
    await prisma.subscription.updateMany({
      where: { externalSubscriptionId: subscriptionId },
      data: {
        status: "CANCELLED",
        cancelAtPeriodEnd: eventType === "BILLING.SUBSCRIPTION.CANCELLED",
        ...(nextBilling ? { currentPeriodEnd: new Date(nextBilling) } : {}),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
