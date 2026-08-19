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


/**
 * Cloudflare's shared edge ranges. A domain sitting behind the orange cloud
 * resolves here instead of to us even when the CNAME is correct, because
 * Cloudflare answers with its own addresses — so verification fails for a
 * reason the owner cannot see from their DNS panel, where the record looks
 * right. Worth naming explicitly: whobela's own zone is on Cloudflare, so a
 * meaningful share of users will be too.
 */
const CLOUDFLARE_PREFIXES = [
  "104.16.", "104.17.", "104.18.", "104.19.", "104.20.", "104.21.", "104.22.", "104.23.",
  "104.24.", "104.25.", "104.26.", "104.27.", "104.28.", "104.29.", "104.30.", "104.31.",
  "172.64.", "172.65.", "172.66.", "172.67.", "172.68.", "172.69.", "172.70.", "172.71.",
  "188.114.", "162.158.", "198.41.",
];

function looksProxiedByCloudflare(addresses: string[]): boolean {
  return addresses.some((a) => CLOUDFLARE_PREFIXES.some((p) => a.startsWith(p)));
}

/** What a host currently resolves to, for a failure message the owner can act on. */
async function currentAddresses(host: string): Promise<string[]> {
  try {
    return await resolve4(host);
  } catch {
    return [];
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
    const found = await currentAddresses(wwwForm(bare));
    let error: string;
    if (found.length === 0) {
      error = `${wwwForm(bare)} isn't pointing anywhere yet. Add the CNAME record, then try again — DNS changes can take a few minutes, occasionally up to 48 hours.`;
    } else if (looksProxiedByCloudflare(found)) {
      error = `${wwwForm(bare)} is going through Cloudflare's proxy (it resolves to ${found[0]}), so it never reaches us. In Cloudflare, open the DNS record and switch it from "Proxied" (orange cloud) to "DNS only" (grey cloud).`;
    } else {
      error = `${wwwForm(bare)} points at ${found.join(", ")} instead of ${target}. Check the CNAME record's value, then try again.`;
    }
    return NextResponse.json({ verified: false, error }, { status: 400 });
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
