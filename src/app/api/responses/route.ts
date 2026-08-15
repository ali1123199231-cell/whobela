import { NextResponse } from "next/server";
import { format, parseISO } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { responseSubmitSchema } from "@/lib/validation";
import { getLiveStatus } from "@/lib/date-page";
import { sendNewResponseEmail } from "@/lib/email";
import { sendPushToUser } from "@/lib/push";
import { DEFAULT_SCHEDULING_CONFIG, isValidBookingSlot, withDefaults } from "@/lib/date-page-defaults";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * The caller's inbox, newest first.
 *
 * The web inbox is a server component that reads Prisma directly and takes
 * every response ever — fine for a page render, not fine for an app that
 * refreshes on every launch over mobile data. This pages instead, keyed on a
 * response id rather than an offset so that an answer landing mid-scroll can't
 * shift the window and hide the row underneath it.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const requested = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_LIMIT) : DEFAULT_LIMIT;
  const cursor = url.searchParams.get("cursor");

  // One extra row is fetched purely to find out whether another page exists,
  // and dropped before responding.
  const rows = await prisma.response.findMany({
    where: { datePage: { userId: session.userId } },
    // createdAt alone is not a stable sort: two people answering in the same
    // millisecond would page unpredictably, repeating one row and skipping the
    // other. The id breaks the tie.
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  return NextResponse.json({
    responses: page.map((r) => ({
      id: r.id,
      recipientName: r.recipientName,
      contact: r.recipientContact,
      message: r.recipientMessage,
      preferences: Array.isArray(r.preferenceSelections) ? r.preferenceSelections : [],
      chosenDate: r.chosenDate,
      chosenTime: r.chosenTime,
      timezone: r.timezone,
      photoUrl: r.recipientPhotoMediaId ? `/api/media/${r.recipientPhotoMediaId}` : null,
      createdAt: r.createdAt.toISOString(),
    })),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const datePageId = body?.datePageId;
  if (typeof datePageId !== "string") {
    return NextResponse.json({ error: "Missing datePageId" }, { status: 400 });
  }

  const parsed = responseSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const datePage = await prisma.datePage.findUnique({
    where: { id: datePageId },
    include: { user: true },
  });
  if (!datePage || !getLiveStatus(datePage).isLive) {
    return NextResponse.json({ error: "This invitation is no longer available" }, { status: 404 });
  }

  const data = parsed.data;
  const schedulingConfig = withDefaults(datePage.schedulingConfig, DEFAULT_SCHEDULING_CONFIG);
  if (!isValidBookingSlot(schedulingConfig, data.chosenDate, data.chosenTime)) {
    return NextResponse.json({ error: "That date/time isn't available" }, { status: 400 });
  }

  const response = await prisma.response.create({
    data: {
      datePageId,
      recipientName: data.recipientName,
      recipientContact: data.recipientContact,
      recipientMessage: data.recipientMessage || null,
      recipientPhotoMediaId: data.recipientPhotoMediaId,
      preferenceSelections: data.preferenceSelections ?? [],
      chosenDate: data.chosenDate,
      chosenTime: data.chosenTime,
      timezone: data.timezone,
    },
  });

  if (datePage.user.emailNotificationsEnabled) {
    void sendNewResponseEmail(datePage.user.email, {
      recipientName: data.recipientName,
      datePageName: datePage.name,
    });
  }

  // Not gated on emailNotificationsEnabled: agreeing to notifications in the
  // browser is its own explicit opt-in, and someone who muted email may well
  // have muted it *because* they'd rather be told this way.
  // "Saturday, August 16", not "2026-08-16". A notification is read in a glance
  // on a lock screen, and an ISO date there reads like a machine talking.
  const friendlyDate = format(parseISO(data.chosenDate), "EEEE, MMMM d");

  void sendPushToUser(datePage.userId, {
    title: `${data.recipientName} said yes 💌`,
    body: `${friendlyDate} at ${data.chosenTime}. Tap to see their details.`,
    url: "/dashboard/inbox",
    // Tagging per response, so two people answering while the phone is in a
    // pocket produce two notifications. The service worker's fallback tag is a
    // constant, and a shared tag makes each new notification *replace* the last
    // — which quietly loses the news that someone said yes.
    tag: response.id,
  });

  return NextResponse.json({ ok: true, id: response.id });
}
