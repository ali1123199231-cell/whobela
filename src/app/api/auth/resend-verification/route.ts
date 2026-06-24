import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode, RESEND_COOLDOWN_MS } from "@/lib/email-verification";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true });
  }

  if (user.verificationCodeSentAt) {
    const elapsed = Date.now() - user.verificationCodeSentAt.getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      return NextResponse.json(
        { error: "Please wait a bit before requesting another code", retryAfterMs: RESEND_COOLDOWN_MS - elapsed },
        { status: 429 }
      );
    }
  }

  await sendVerificationCode(user, user.profile?.firstName ?? "");
  return NextResponse.json({ ok: true, sentAt: new Date().toISOString() });
}
