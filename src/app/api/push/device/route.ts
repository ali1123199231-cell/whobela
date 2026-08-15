import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// FCM registration tokens are opaque and have no documented maximum, so the
// bound is generous rather than exact — long enough for anything Google has
// issued, short enough that nobody can post a novel.
const deviceSchema = z.object({
  token: z.string().min(1).max(500),
  platform: z.enum(["android", "ios"]),
  appVersion: z.string().max(32).optional(),
});

/**
 * Registers this install for notifications.
 *
 * The app calls this on every launch, not just when permission is first
 * granted: FCM rotates registration tokens on its own schedule — after a
 * restore, a reinstall, a clear-data — and a token nobody re-registered is a
 * phone that silently stops being notified.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = deviceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid device token" }, { status: 400 });
  }
  const { token, platform, appVersion } = parsed.data;

  // Upserting on the token reassigns the phone when a second account signs in
  // on it, which is the behaviour you want: notifications should follow whoever
  // is actually logged in, not whoever got there first.
  await prisma.deviceToken.upsert({
    where: { token },
    create: { token, platform, appVersion, userId: session.userId },
    update: { platform, appVersion, userId: session.userId, lastSeenAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

/** Called on sign-out, so the next person to use the phone isn't told who said yes. */
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : null;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  // Scoped to the caller so a token can't be unregistered by whoever guesses it.
  await prisma.deviceToken.deleteMany({ where: { token, userId: session.userId } });

  return NextResponse.json({ ok: true });
}
