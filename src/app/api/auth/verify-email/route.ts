import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { verifyEmailSchema } from "@/lib/validation";

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

  const matches = await verifyPassword(parsed.data.code, user.verificationCodeHash);
  if (!matches) {
    return NextResponse.json({ error: "Incorrect code, try again" }, { status: 400 });
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
