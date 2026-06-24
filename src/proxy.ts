import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  const rootDomain = (process.env.ROOT_DOMAIN ?? "localhost:3000").toLowerCase();
  const host = (request.headers.get("host") ?? "").toLowerCase();

  if (!host || host === rootDomain || host === `www.${rootDomain}`) {
    return NextResponse.next();
  }

  if (host.endsWith(`.${rootDomain}`)) {
    const username = host.slice(0, -(rootDomain.length + 1));
    const url = request.nextUrl.clone();
    url.pathname = `/r/${username}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Not our root domain or a subdomain of it — only remaining possibility is
  // a verified custom domain connected via Settings.
  const datePage = await prisma.datePage.findFirst({
    where: { customDomain: host, customDomainVerifiedAt: { not: null } },
    include: { user: true },
  });
  if (datePage) {
    const url = request.nextUrl.clone();
    url.pathname = `/r/${datePage.user.username}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
