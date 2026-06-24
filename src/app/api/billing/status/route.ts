import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe";
import { isPaypalConfigured } from "@/lib/paypal";
import { isBillingBypassed } from "@/lib/date-page";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.userId } });
  const [stripeReady, paypalReady, bypassBilling] = await Promise.all([
    isStripeConfigured(),
    isPaypalConfigured(),
    isBillingBypassed(),
  ]);

  return NextResponse.json({
    subscription,
    stripeReady,
    paypalReady,
    bypassBilling,
  });
}
