import { NextResponse } from "next/server";
import { getSession, verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changeEmailSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = changeEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.newEmail } });
  if (existing && existing.id !== session.userId) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  await prisma.user.update({ where: { id: session.userId }, data: { email: parsed.data.newEmail } });

  const token = await createSessionToken({ userId: session.userId, email: parsed.data.newEmail, username: session.username });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
