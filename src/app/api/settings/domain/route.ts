import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { connectDomainSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = connectDomainSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.datePage.findUnique({ where: { customDomain: parsed.data.domain } });
  if (existing && existing.userId !== session.userId) {
    return NextResponse.json({ error: "That domain is already connected to another page" }, { status: 409 });
  }

  const datePage = await prisma.datePage.update({
    where: { userId: session.userId },
    data: { customDomain: parsed.data.domain, customDomainVerifiedAt: null },
  });
  return NextResponse.json({ datePage });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const datePage = await prisma.datePage.update({
    where: { userId: session.userId },
    data: { customDomain: null, customDomainVerifiedAt: null },
  });
  return NextResponse.json({ datePage });
}
