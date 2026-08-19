import { NextResponse } from "next/server";
import { resolveNs } from "node:dns/promises";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { connectDomainSchema } from "@/lib/validation";
import { bareDomain } from "@/lib/custom-domain";

/**
 * Does this domain exist at all? Both custom domains ever entered in production
 * were ones the owner did not actually have — one belonged to a stranger, the
 * other was never registered — so the setup instructions alone clearly do not
 * land. A domain that is registered has nameservers even before it points
 * anywhere, so NXDOMAIN is a reliable "you have not bought this yet".
 *
 * Returns null when DNS itself failed, so a resolver hiccup never accuses
 * someone of not owning a domain they do own.
 */
async function domainIsRegistered(domain: string): Promise<boolean | null> {
  try {
    const servers = await resolveNs(bareDomain(domain));
    return servers.length > 0;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return code === "ENOTFOUND" || code === "NXDOMAIN" ? false : null;
  }
}

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

  const registered = await domainIsRegistered(parsed.data.domain);

  const datePage = await prisma.datePage.update({
    where: { userId: session.userId },
    data: {
      customDomain: parsed.data.domain,
      customDomainVerifiedAt: null,
      customDomainRedirectVerifiedAt: null,
    },
  });
  // Saved either way: someone who bought a domain minutes ago may not have
  // nameservers visible yet, and refusing them would be worse than warning.
  return NextResponse.json({ datePage, registered });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const datePage = await prisma.datePage.update({
    where: { userId: session.userId },
    data: {
      customDomain: null,
      customDomainVerifiedAt: null,
      customDomainRedirectVerifiedAt: null,
    },
  });
  return NextResponse.json({ datePage });
}
