import { NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: session.userId },
    // Invalidate every other outstanding session — see lib/auth.ts.
    data: { passwordHash, tokenVersion: { increment: 1 } },
  });

  // The increment above invalidates the JWT the caller is currently using
  // too (its embedded tokenVersion is now stale), so re-issue a fresh one
  // for this session rather than silently logging the user out.
  const token = await createSessionToken({
    userId: session.userId,
    email: session.email,
    username: session.username,
    tokenVersion: session.tokenVersion + 1,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
