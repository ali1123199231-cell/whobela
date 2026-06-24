import { NextResponse } from "next/server";
import { getSession, verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changeEmailSchema } from "@/lib/validation";
import { sendVerificationCode } from "@/lib/email-verification";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = changeEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { profile: true } });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.newEmail } });
  if (existing && existing.id !== session.userId) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  // Changing the email means we no longer know the new address is actually
  // reachable by this user — reset verification status and re-send a code,
  // same as a fresh signup, instead of carrying over verification of the
  // old (now-abandoned) address.
  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: { email: parsed.data.newEmail, emailVerifiedAt: null },
  });

  const token = await createSessionToken({
    userId: session.userId,
    email: parsed.data.newEmail,
    username: session.username,
    tokenVersion: session.tokenVersion,
  });
  await setSessionCookie(token);
  await sendVerificationCode(updated, user.profile?.firstName ?? "");

  return NextResponse.json({ ok: true });
}
