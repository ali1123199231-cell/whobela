import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";

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
  const matches = await verifyPassword(code, user.resetCodeHash);
  if (!matches) {
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
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
