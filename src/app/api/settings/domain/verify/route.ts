import { NextResponse } from "next/server";
import { resolve4 } from "node:dns/promises";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bareDomain, cnameTarget, wwwForm } from "@/lib/custom-domain";

/**
 * Resolve every address the CNAME target currently answers with. Matching on
 * addresses rather than reading the CNAME record itself is deliberate: it also
 * accepts CNAME flattening / ALIAS / ANAME records, which is what a user on
 * Cloudflare gets if they point the apex at us, and what some registrars
 * silently rewrite a CNAME into.
 */
async function targetAddresses(): Promise<string[]> {
  try {
    return await resolve4(cnameTarget());
  } catch {
    return [];
  }
}

async function pointsAtUs(host: string, targets: string[]): Promise<boolean> {
  try {
    const addresses = await resolve4(host);
    return addresses.some((a) => targets.includes(a));
  } catch {
    return false;
  }
}

/**
 * Best-effort check for the optional apex -> www redirect. Plain HTTP on
 * purpose: the apex usually has no certificate of ours (that is the whole point
 * of the redirect living at the registrar), so HTTPS would fail even when the
 * redirect is correctly configured.
 */
async function apexRedirectsToWww(domain: string): Promise<boolean> {
  const bare = bareDomain(domain);
  try {
    const res = await fetch(`http://${bare}`, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(4000),
    });
    if (res.status < 300 || res.status >= 400) return false;
    return (res.headers.get("location") ?? "").includes(wwwForm(bare));
  } catch {
    return false;
  }
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const datePage = await prisma.datePage.findUnique({ where: { userId: session.userId } });
  if (!datePage?.customDomain) {
    return NextResponse.json({ error: "No domain connected yet" }, { status: 400 });
  }

  const target = cnameTarget();
  const targets = await targetAddresses();
  if (targets.length === 0) {
    return NextResponse.json(
      { error: "We couldn't check DNS just now — please try again in a moment" },
      { status: 503 }
    );
  }

  const bare = bareDomain(datePage.customDomain);
  // The instructions put the CNAME on "www", but accept the apex too: someone
  // whose registrar supports ALIAS/ANAME may point the root at us instead, and
  // that works just as well.
  const [wwwOk, apexOk] = await Promise.all([
    pointsAtUs(wwwForm(bare), targets),
    pointsAtUs(bare, targets),
  ]);

  if (!wwwOk && !apexOk) {
    return NextResponse.json(
      {
        verified: false,
        error: `${wwwForm(bare)} isn't pointing at ${target} yet. DNS changes can take a few minutes to a few hours — if you've just added the record, try again shortly.`,
      },
      { status: 400 }
    );
  }

  // DNS is correct, so the domain goes live immediately. The apex redirect is
  // optional and gates nothing; we detect it only so Settings can tell the
  // owner whether the bare domain will also reach their page.
  const redirectOk = apexOk ? true : await apexRedirectsToWww(bare);

  const updated = await prisma.datePage.update({
    where: { userId: session.userId },
    data: {
      customDomainVerifiedAt: datePage.customDomainVerifiedAt ?? new Date(),
      customDomainRedirectVerifiedAt: redirectOk ? new Date() : null,
    },
  });

  return NextResponse.json({
    verified: true,
    apexReachable: apexOk || redirectOk,
    datePage: updated,
  });
}
