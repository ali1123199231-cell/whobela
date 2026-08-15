import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { log, clientOf } from "@/lib/log";

/**
 * Where the app reports its own crashes.
 *
 * A bad web deploy is fixed in minutes; a bad APK sits on phones until people
 * choose to update, and without this the only evidence of a crash is a user who
 * doesn't come back. Play Console shows crash clusters but strips the context
 * that says which screen and which account.
 *
 * This is not a Sentry replacement — no grouping, no release health, no
 * symbolication. It is the part that matters when there is no Sentry: the stack
 * reaches a log we can grep, tagged with the build that produced it.
 *
 * Deliberately accepts unauthenticated reports. A crash on the signup screen is
 * exactly the one worth hearing about, and there is no session at that point.
 */
const errorSchema = z.object({
  message: z.string().max(500),
  stack: z.string().max(4000).optional(),
  // Where in the app: a route name, "global", or "render".
  context: z.string().max(120).optional(),
  fatal: z.boolean().optional(),
  appVersion: z.string().max(32).optional(),
  versionCode: z.number().int().nonnegative().optional(),
  platform: z.string().max(16).optional(),
  osVersion: z.string().max(32).optional(),
  model: z.string().max(64).optional(),
});

export async function POST(request: Request) {
  const parsed = errorSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    // Never argue with a crash report. A malformed one still means something
    // went wrong on a phone, and a 400 here would lose that entirely.
    log.warn("app.error.malformed", { client: clientOf(request) });
    return NextResponse.json({ ok: true });
  }

  // Best-effort: a crash on a signed-out screen still reports, just anonymously.
  const session = await getSession().catch(() => null);

  log.error("app.error", {
    client: clientOf(request),
    userId: session?.userId ?? null,
    ...parsed.data,
    // Trimmed hard. The top of a stack is where the cause is, and a log line
    // long enough to wrap a terminal is a log line nobody reads.
    stack: parsed.data.stack?.split("\n").slice(0, 12).join(" | ").slice(0, 1500),
  });

  return NextResponse.json({ ok: true });
}
