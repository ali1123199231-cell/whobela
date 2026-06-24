import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { datePageUpdateSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Every account gets a DatePage at signup, but upsert defensively in case
  // of pre-existing test accounts created before that wiring existed.
  const datePage = await prisma.datePage.upsert({
    where: { userId: session.userId },
    update: {},
    create: { userId: session.userId, name: "My date page" },
  });
  return NextResponse.json({ datePage });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = datePageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  // Only fields actually present in the request are included by safeParse's
  // output (the schema's keys are all .optional()), so this still supports
  // partial updates of one config field at a time.
  const data = parsed.data;

  const datePage = await prisma.datePage.upsert({
    where: { userId: session.userId },
    update: data,
    create: { userId: session.userId, name: "My date page", ...data },
  });
  return NextResponse.json({ datePage });
}
