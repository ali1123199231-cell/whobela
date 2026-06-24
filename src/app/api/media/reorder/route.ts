import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const owned = await prisma.media.findMany({
    where: { id: { in: ids }, userId: session.userId, kind: "PROFILE_PHOTO" },
    select: { id: true },
  });
  if (owned.length !== ids.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.$transaction(
    ids.map((id: string, index: number) => prisma.media.update({ where: { id }, data: { order: index } }))
  );

  return NextResponse.json({ ok: true });
}
