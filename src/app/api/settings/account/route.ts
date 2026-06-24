import { NextResponse } from "next/server";
import { getSession, clearSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteAccountSchema } from "@/lib/validation";

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = deleteAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  if (parsed.data.usernameConfirmation !== session.username) {
    return NextResponse.json({ error: "Type your username exactly to confirm" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: session.userId } });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
