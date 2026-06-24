import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetCode, RESET_RESEND_COOLDOWN_MS } from "@/lib/password-reset";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always respond ok, whether or not the email exists, so this endpoint
  // can't be used to probe which emails have accounts.
  if (user) {
    const onCooldown =
      user.resetCodeSentAt && Date.now() - user.resetCodeSentAt.getTime() < RESET_RESEND_COOLDOWN_MS;
    if (!onCooldown) {
      await sendPasswordResetCode(user);
    }
  }

  return NextResponse.json({ ok: true });
}
