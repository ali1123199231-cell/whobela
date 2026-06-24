import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, setSessionCookie, MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_MS } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user?.loginLockedUntil && user.loginLockedUntil.getTime() > Date.now()) {
    const minutes = Math.ceil((user.loginLockedUntil.getTime() - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
      { status: 429 }
    );
  }

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    if (user) {
      const attempts = user.failedLoginAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data:
          attempts >= MAX_LOGIN_ATTEMPTS
            ? { failedLoginAttempts: attempts, loginLockedUntil: new Date(Date.now() + LOGIN_LOCKOUT_MS) }
            : { failedLoginAttempts: attempts },
      });
    }
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (user.failedLoginAttempts > 0 || user.loginLockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, loginLockedUntil: null },
    });
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    tokenVersion: user.tokenVersion,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
