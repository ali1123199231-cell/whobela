import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createPaypalSubscription } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const origin = new URL(request.url).origin;
  const result = await createPaypalSubscription(
    session.userId,
    `${origin}/dashboard/settings?success=1`,
    `${origin}/dashboard/settings?cancelled=1`
  );

  if (!result?.approveUrl) {
    return NextResponse.json({ error: "Payments are coming soon" }, { status: 503 });
  }

  await prisma.subscription.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, provider: "PAYPAL", externalSubscriptionId: result.subscriptionId, status: "PAST_DUE" },
    update: { provider: "PAYPAL", externalSubscriptionId: result.subscriptionId, status: "PAST_DUE" },
  });

  return NextResponse.json({ url: result.approveUrl });
}
