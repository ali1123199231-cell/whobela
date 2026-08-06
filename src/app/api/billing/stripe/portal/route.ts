import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";
import { getRootOrigin } from "@/lib/config";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = await getStripeClient();
  if (!stripe) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.userId } });
  if (!subscription || subscription.provider !== "STRIPE") {
    return NextResponse.json({ error: "No Stripe subscription found" }, { status: 400 });
  }

  try {
    // We only persist the subscription id, so read the customer back off the
    // subscription instead of storing it — this keeps working for everyone
    // who subscribed before the portal existed.
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.externalSubscriptionId);
    const customer =
      typeof stripeSubscription.customer === "string"
        ? stripeSubscription.customer
        : stripeSubscription.customer.id;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getRootOrigin()}/dashboard/billing`,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch {
    // The portal needs a configuration saved in the Stripe dashboard, which
    // is a manual step we can't do from here. Cancelling doesn't depend on
    // it, so point the user at the button that always works.
    return NextResponse.json(
      { error: "The billing portal isn't available right now. You can still cancel below." },
      { status: 503 }
    );
  }
}
