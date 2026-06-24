import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";
import { MAX_RESET_ATTEMPTS } from "@/lib/password-reset";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { email, code, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetCodeHash || !user.resetCodeExpiresAt) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }
  if (user.resetCodeExpiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "That code expired — request a new one" }, { status: 400 });
  }
  if (user.resetCodeAttempts >= MAX_RESET_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts — request a new code" }, { status: 429 });
  }
  const matches = await verifyPassword(code, user.resetCodeHash);
  if (!matches) {
    const attempts = user.resetCodeAttempts + 1;
    await prisma.user.update({
      where: { id: user.id },
      data:
        attempts >= MAX_RESET_ATTEMPTS
          ? { resetCodeAttempts: attempts, resetCodeHash: null, resetCodeExpiresAt: null }
          : { resetCodeAttempts: attempts },
    });
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetCodeHash: null,
      resetCodeExpiresAt: null,
      resetCodeSentAt: null,
      resetCodeAttempts: 0,
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
      // Invalidate every other outstanding session — see lib/auth.ts.
      tokenVersion: { increment: 1 },
    },
  });

  return NextResponse.json({ ok: true });
}
