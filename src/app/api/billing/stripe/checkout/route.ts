import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripeClient, getStripePublicConfig } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = await getStripeClient();
  const { STRIPE_PRICE_ID } = await getStripePublicConfig();
  if (!stripe || !STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Payments are coming soon" }, { status: 503 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  const origin = new URL(request.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    client_reference_id: session.userId,
    customer_email: user?.email,
    success_url: `${origin}/dashboard/settings?success=1`,
    cancel_url: `${origin}/dashboard/settings?cancelled=1`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
