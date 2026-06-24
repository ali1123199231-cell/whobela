import { NextResponse } from "next/server";
import { resolve4 } from "node:dns/promises";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const serverIp = process.env.SERVER_IP;
  if (!serverIp) {
    return NextResponse.json(
      { error: "Domain verification isn't available in this environment" },
      { status: 503 }
    );
  }

  const datePage = await prisma.datePage.findUnique({ where: { userId: session.userId } });
  if (!datePage?.customDomain) {
    return NextResponse.json({ error: "No domain connected yet" }, { status: 400 });
  }

  let resolved: string[];
  try {
    resolved = await resolve4(datePage.customDomain);
  } catch {
    return NextResponse.json(
      { error: "Couldn't resolve that domain's DNS yet — make sure the A record is set and try again in a few minutes" },
      { status: 400 }
    );
  }

  if (!resolved.includes(serverIp)) {
    return NextResponse.json(
      { error: `That domain doesn't point at ${serverIp} yet` },
      { status: 400 }
    );
  }

  const updated = await prisma.datePage.update({
    where: { userId: session.userId },
    data: { customDomainVerifiedAt: new Date() },
  });
  return NextResponse.json({ datePage: updated });
}
