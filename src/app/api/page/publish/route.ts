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

/**
 * Takes a published page back offline.
 *
 * Until this existed, publishing was a one-way door: the only way to remove a
 * page was to delete the whole account, which also destroyed the responses the
 * user had received. For a page that carries someone's photo and a romantic
 * question addressed to a specific person, "you can never take this down" is
 * the wrong default.
 */
export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.datePage.findUnique({ where: { userId: session.userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const datePage = await prisma.datePage.update({
    where: { userId: session.userId },
    data: {
      status: "DRAFT",
      // Cleared so publishedAt always means "live since", never a stale date on
      // an offline page. firstPublishedAt is deliberately left alone: it records
      // that this page was once public, which unpublishing doesn't undo.
      publishedAt: null,
    },
  });
  return NextResponse.json({ datePage });
}
