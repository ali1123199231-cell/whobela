import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.datePage.findUnique({ where: { userId: session.userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const datePage = await prisma.datePage.update({
    where: { userId: session.userId },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
      firstPublishedAt: existing.firstPublishedAt ?? now,
    },
  });
  return NextResponse.json({ datePage });
}
