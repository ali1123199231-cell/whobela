import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { responseSubmitSchema } from "@/lib/validation";
import { getLiveStatus, isBillingBypassed } from "@/lib/date-page";
import { sendNewResponseEmail } from "@/lib/email";
import { isShowcaseAccount } from "@/lib/showcase";
import { DEFAULT_SCHEDULING_CONFIG, isValidBookingSlot, withDefaults } from "@/lib/date-page-defaults";

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
    include: { user: { include: { subscription: true } } },
  });
  const subscriptionActive =
    (await isBillingBypassed()) ||
    datePage?.user.subscription?.status === "ACTIVE" ||
    (datePage ? await isShowcaseAccount(datePage.user.username) : false);
  if (!datePage || !getLiveStatus(datePage, subscriptionActive).isLive) {
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

  return NextResponse.json({ ok: true, id: response.id });
}
