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
    await prisma.subscription.updateMany({
      where: { externalSubscriptionId: subscriptionId },
      data: { status: "ACTIVE" },
    });
  } else if (CANCELLED_EVENTS.has(eventType)) {
    await prisma.subscription.updateMany({
      where: { externalSubscriptionId: subscriptionId },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json({ ok: true });
}
