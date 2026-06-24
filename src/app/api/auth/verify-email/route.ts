import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { verifyEmailSchema } from "@/lib/validation";
import { MAX_CODE_ATTEMPTS } from "@/lib/email-verification";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = verifyEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true });
  }

  if (!user.verificationCodeHash || !user.verificationCodeExpiresAt) {
    return NextResponse.json({ error: "No code is pending — request a new one" }, { status: 400 });
  }
  if (user.verificationCodeExpiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "That code expired — request a new one" }, { status: 400 });
  }
  if (user.verificationCodeAttempts >= MAX_CODE_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts — request a new code" }, { status: 429 });
  }

  const matches = await verifyPassword(parsed.data.code, user.verificationCodeHash);
  if (!matches) {
    const attempts = user.verificationCodeAttempts + 1;
    await prisma.user.update({
      where: { id: user.id },
      data:
        attempts >= MAX_CODE_ATTEMPTS
          ? { verificationCodeAttempts: attempts, verificationCodeHash: null, verificationCodeExpiresAt: null }
          : { verificationCodeAttempts: attempts },
    });
    const remaining = MAX_CODE_ATTEMPTS - attempts;
    return NextResponse.json(
      {
        error:
          remaining > 0
            ? `Incorrect code, try again (${remaining} attempt${remaining === 1 ? "" : "s"} left)`
            : "Too many attempts — request a new code",
      },
      { status: remaining > 0 ? 400 : 429 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      verificationCodeHash: null,
      verificationCodeExpiresAt: null,
      verificationCodeSentAt: null,
    },
  });

  return NextResponse.json({ ok: true });
}
