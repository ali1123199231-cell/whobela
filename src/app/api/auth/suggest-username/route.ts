import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usernamePattern, isReservedUsername } from "@/lib/validation";

/**
 * Whether a username is free, and if not, some that are.
 *
 * check-username already answers the first half, but answering only "taken"
 * leaves the person to guess again, which is the part that actually annoys.
 * Candidates are generated and filtered here rather than on the client so the
 * pattern and the reserved list — `connect` in particular, which every custom
 * domain CNAMEs to — stay in one place and cannot drift out of a copy in the
 * app.
 *
 * One query answers all of it: candidates are looked up together rather than
 * one request per guess.
 */

const MAX_SUGGESTIONS = 3;

/** Trim a display name or half-typed handle down to something legal. */
function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    // Strip accents rather than dropping the letters: "josé" should suggest
    // "jose", not "jos".
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function candidatesFor(base: string): string[] {
  const year = new Date().getFullYear() % 100;
  const out = [
    `${base}${year}`,
    `${base}x`,
    `ask${base}`,
    `${base}-date`,
    `the${base}`,
    `${base}1`,
  ];
  // A short base makes short candidates; the pattern needs at least three
  // characters, so anything still too short is dropped rather than padded
  // into something that reads like a typo.
  for (let n = 2; out.length < 24; n++) out.push(`${base}${n}`);
  return out.filter((name) => usernamePattern.test(name) && !isReservedUsername(name));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = normalise(searchParams.get("base") ?? searchParams.get("username") ?? "");

  if (!base) return NextResponse.json({ available: false, suggestions: [] });

  const wanted = usernamePattern.test(base) && !isReservedUsername(base);
  const candidates = candidatesFor(base);

  // The requested name and every candidate in a single round trip.
  const lookup = wanted ? [base, ...candidates] : candidates;
  const taken = new Set(
    (
      await prisma.user.findMany({
        where: { username: { in: lookup } },
        select: { username: true },
      })
    ).map((row) => row.username)
  );

  return NextResponse.json({
    available: wanted && !taken.has(base),
    suggestions: candidates.filter((name) => !taken.has(name)).slice(0, MAX_SUGGESTIONS),
  });
}
