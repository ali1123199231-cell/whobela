import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CURRENT_PLAN = "monthly-2.99";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const provider = body.provider === "stripe" ? "STRIPE" : body.provider === "paypal" ? "PAYPAL" : null;
  if (!provider) return NextResponse.json({ error: "Invalid provider" }, { status: 400 });

  await prisma.billingClickEvent.create({
    data: { userId: session.userId, provider, plan: CURRENT_PLAN },
  });

  return NextResponse.json({ ok: true });
}
