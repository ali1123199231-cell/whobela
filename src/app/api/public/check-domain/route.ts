import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Caddy on-demand TLS "ask" endpoint: called before issuing a certificate
// for a hostname. Mirrors smartlock2's check-subdomain pattern — only issue
// certs for the root domain(s) or subdomains that map to a real user.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const domain = (url.searchParams.get("domain") ?? "").toLowerCase();
  const rootDomain = (process.env.ROOT_DOMAIN ?? "").toLowerCase();

  if (!domain || !rootDomain) return new NextResponse(null, { status: 403 });

  if (domain === rootDomain || domain === `www.${rootDomain}`) {
    return new NextResponse(null, { status: 200 });
  }

  if (domain.endsWith(`.${rootDomain}`)) {
    const username = domain.slice(0, -(rootDomain.length + 1));
    const user = await prisma.user.findUnique({ where: { username } });
    return new NextResponse(null, { status: user ? 200 : 403 });
  }

  // Custom domain connected via Settings — only approved once the owner has
  // verified their DNS A record points at this server (see
  // /api/settings/domain/verify).
  const datePage = await prisma.datePage.findUnique({ where: { customDomain: domain } });
  return new NextResponse(null, { status: datePage?.customDomainVerifiedAt ? 200 : 403 });
}
