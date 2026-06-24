import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createPaypalSubscription } from "@/lib/paypal";

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

  // Deliberately not writing a Subscription row here: the user hasn't
  // approved anything yet at this point, only started checkout. The row is
  // created by the webhook on BILLING.SUBSCRIPTION.ACTIVATED instead (using
  // resource.custom_id, set to this userId above), matching how the Stripe
  // checkout route doesn't write anything until checkout.session.completed.
  return NextResponse.json({ url: result.approveUrl });
}
