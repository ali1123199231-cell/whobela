import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendReportEmail } from "@/lib/email";

// Deliberately unauthenticated. The person best placed to report an invitation
// page is the one who received it, and they have no account — requiring a login
// here would mean the only people who can report abuse are the people who can't
// be its victims.
const reportSchema = z.object({
  username: z.string().trim().min(1).max(64).optional(),
  reason: z.enum(["HARASSMENT", "IMPERSONATION", "SEXUAL_CONTENT", "CHILD_SAFETY", "SPAM", "OTHER"]),
  details: z.string().trim().max(2000).optional(),
  // Optional on purpose: demanding contact details from someone reporting
  // harassment is a good way to never hear about harassment.
  reporterEmail: z.string().trim().email().max(320).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const parsed = reportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please choose a reason for the report" },
      { status: 400 }
    );
  }
  const { username, reason, details, reporterEmail } = parsed.data;

  // Resolved rather than trusted: the username comes from the page the reporter
  // was looking at, but an unmatched one must not throw the report away — a
  // report about a page that was just deleted is still worth reading.
  const datePage = username
    ? await prisma.datePage.findFirst({
        where: { user: { username } },
        select: { id: true },
      })
    : null;

  const report = await prisma.report.create({
    data: {
      datePageId: datePage?.id ?? null,
      pageUsername: username ?? null,
      pageUrl: username ? `https://${username}.whobela.com` : null,
      reason,
      details: details || null,
      reporterEmail: reporterEmail || null,
    },
  });

  // Best-effort: a report is already durably stored by this point, so a mail
  // failure must not tell the reporter their report was lost.
  void sendReportEmail({
    reportId: report.id,
    reason,
    details: details || null,
    pageUsername: username ?? null,
    reporterEmail: reporterEmail || null,
  });

  return NextResponse.json({ ok: true });
}
