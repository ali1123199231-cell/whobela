import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

const EDITABLE_FIELDS = [
  "name",
  "theme",
  "inviteConfig",
  "yesConfig",
  "noConfig",
  "reactionConfig",
  "schedulingConfig",
  "preferenceConfig",
  "confirmationConfig",
] as const;

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) data[field] = body[field];
  }

  const datePage = await prisma.datePage.upsert({
    where: { userId: session.userId },
    update: data,
    create: { userId: session.userId, name: "My date page", ...data },
  });
  return NextResponse.json({ datePage });
}
