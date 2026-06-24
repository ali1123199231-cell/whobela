import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const stripe = await getStripeClient();
  const webhookSecret = await getStripeWebhookSecret();
  if (!stripe || !webhookSecret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const userId = checkoutSession.client_reference_id;
    const subscriptionId = checkoutSession.subscription;
    if (userId && typeof subscriptionId === "string") {
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, provider: "STRIPE", externalSubscriptionId: subscriptionId, status: "ACTIVE" },
        update: { provider: "STRIPE", externalSubscriptionId: subscriptionId, status: "ACTIVE" },
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const status = subscription.status === "active" ? "ACTIVE" : subscription.status === "past_due" ? "PAST_DUE" : "CANCELLED";
    await prisma.subscription.updateMany({
      where: { externalSubscriptionId: subscription.id },
      data: { status, currentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000) },
    });
  }

  return NextResponse.json({ ok: true });
}
