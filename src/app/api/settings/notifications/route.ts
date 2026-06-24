import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (typeof body?.emailNotificationsEnabled !== "boolean") {
    return NextResponse.json({ error: "Missing emailNotificationsEnabled" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { emailNotificationsEnabled: body.emailNotificationsEnabled },
  });
  return NextResponse.json({ emailNotificationsEnabled: user.emailNotificationsEnabled });
}
