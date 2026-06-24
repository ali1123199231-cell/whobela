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
    // No Subscription row exists yet at this point (checkout creation no
    // longer writes one — see /api/billing/paypal/checkout) — this is the
    // first time we know the subscription was actually approved, so create
    // it here using custom_id (set to the userId at creation time).
    const userId = body.resource?.custom_id as string | undefined;
    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, provider: "PAYPAL", externalSubscriptionId: subscriptionId, status: "ACTIVE" },
        update: { provider: "PAYPAL", externalSubscriptionId: subscriptionId, status: "ACTIVE" },
      });
    }
  } else if (CANCELLED_EVENTS.has(eventType)) {
    await prisma.subscription.updateMany({
      where: { externalSubscriptionId: subscriptionId },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json({ ok: true });
}
