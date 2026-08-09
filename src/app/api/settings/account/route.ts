import { NextResponse } from "next/server";
import { getSession, clearSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteAccountSchema } from "@/lib/validation";
import { cancelSubscriptionAtProvider } from "@/lib/billing";
import { deleteAllUserMedia } from "@/lib/media";

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = deleteAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  if (parsed.data.usernameConfirmation !== session.username) {
    return NextResponse.json({ error: "Type your username exactly to confirm" }, { status: 400 });
  }

  // Cancel before deleting, never after: Subscription cascades away with the
  // user, taking externalSubscriptionId with it, and the provider would go on
  // charging a card for an account that no longer exists. Deleting is
  // irreversible, so a failed cancellation aborts the whole thing rather than
  // leaving the user billed with no account to cancel from.
  const subscription = await prisma.subscription.findUnique({ where: { userId: session.userId } });
  if (subscription && subscription.status !== "CANCELLED") {
    const { ok } = await cancelSubscriptionAtProvider(subscription, "immediately");
    if (!ok) {
      return NextResponse.json(
        {
          error:
            "We couldn't cancel your subscription, so we didn't delete your account — you'd keep getting charged. Please try again or email support@whobela.com.",
        },
        { status: 502 }
      );
    }
  }

  // Photos before the user row. Deleting the user cascades the media rows away,
  // and once those are gone nothing records where the files live — so doing this
  // second would strand every photo in the uploads volume permanently. This also
  // covers recipient photos, which have no owner to cascade from.
  await deleteAllUserMedia(session.userId);

  await prisma.user.delete({ where: { id: session.userId } });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
