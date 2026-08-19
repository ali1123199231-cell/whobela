import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usernamePattern, isReservedUsername } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") ?? "").toLowerCase();

  if (!usernamePattern.test(username) || isReservedUsername(username)) {
    return NextResponse.json({ available: false });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  return NextResponse.json({ available: !existing });
}
