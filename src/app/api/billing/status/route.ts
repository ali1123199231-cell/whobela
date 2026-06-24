import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe";
import { isPaypalConfigured } from "@/lib/paypal";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.userId } });
  const [stripeReady, paypalReady] = await Promise.all([isStripeConfigured(), isPaypalConfigured()]);
  const bypassBilling = process.env.BILLING_BYPASS === "true" && process.env.APP_ENV !== "production";

  return NextResponse.json({
    subscription,
    stripeReady,
    paypalReady,
    bypassBilling,
  });
}
