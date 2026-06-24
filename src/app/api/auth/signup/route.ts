import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { sendVerificationCode } from "@/lib/email-verification";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { email, password, username, firstName } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return NextResponse.json(
      { error: existing.email === email ? "Email already in use" : "Username already taken" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      profile: { create: { firstName } },
      datePage: { create: { name: "My date page" } },
    },
  });

  const token = await createSessionToken({ userId: user.id, email: user.email, username: user.username });
  await setSessionCookie(token);
  await sendVerificationCode(user, firstName);

  return NextResponse.json({ ok: true });
}
