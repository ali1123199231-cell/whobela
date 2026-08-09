import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVapidPublicKey } from "@/lib/push";

// The browser hands back an endpoint URL chosen by its own push service, plus
// the two keys used to encrypt payloads to it. Lengths are generous rather
// than exact — the endpoint format is the push service's business, not ours.
const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2000),
  keys: z.object({
    p256dh: z.string().min(1).max(500),
    auth: z.string().min(1).max(500),
  }),
});

/** The public key the browser needs before it can subscribe. */
export async function GET() {
  const publicKey = await getVapidPublicKey();
  if (!publicKey) return NextResponse.json({ configured: false, publicKey: null });
  return NextResponse.json({ configured: true, publicKey });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = subscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
  const { endpoint, keys } = parsed.data;

  // An endpoint is unique to a browser, and browsers hand back the same one on
  // re-subscribe. Upserting keeps re-granting permission idempotent, and
  // reassigns the endpoint if a different account signs in on that browser.
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId: session.userId },
    update: { p256dh: keys.p256dh, auth: keys.auth, userId: session.userId },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const endpoint = typeof body?.endpoint === "string" ? body.endpoint : null;
  if (!endpoint) return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });

  // Scoped to the caller so an endpoint can't be removed by whoever guesses it.
  await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: session.userId } });

  return NextResponse.json({ ok: true });
}
