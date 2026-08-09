import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";
import { render } from "@react-email/render";
import { getConfig, getConfigMany, CONFIG_KEYS, getRootOrigin } from "@/lib/config";
import { LEGAL } from "@/lib/legal";
import { VerificationCodeEmail } from "@/emails/verification-code";
import { PasswordResetEmail } from "@/emails/password-reset";
import { NewResponseEmail } from "@/emails/new-response";

const isDev = process.env.APP_ENV === "development";

let mailhogTransport: Transporter | null = null;

function getMailhogTransport(): Transporter {
  if (!mailhogTransport) {
    mailhogTransport = nodemailer.createTransport({
      host: process.env.MAILHOG_HOST || "localhost",
      port: Number(process.env.MAILHOG_PORT) || 1025,
      secure: false,
      ignoreTLS: true,
    });
  }
  return mailhogTransport;
}

async function getResendClient(): Promise<{ client: Resend; from: string } | null> {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = await getConfigMany([
    CONFIG_KEYS.RESEND_API_KEY,
    CONFIG_KEYS.RESEND_FROM_EMAIL,
  ]);
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) return null;
  return { client: new Resend(RESEND_API_KEY), from: RESEND_FROM_EMAIL };
}

export async function isResendConfigured() {
  return Boolean(await getConfig(CONFIG_KEYS.RESEND_API_KEY)) && Boolean(await getConfig(CONFIG_KEYS.RESEND_FROM_EMAIL));
}

type Mail = { to: string; subject: string; html: string };

/**
 * APP_ENV=development (localhost) always goes to Mailhog, regardless of
 * whatever Resend config happens to be sitting in system_config — staging
 * (dev.whobela.com) and production always use Resend.
 */
async function deliver(mail: Mail) {
  if (isDev) {
    await getMailhogTransport().sendMail({ from: "whobela <dev@whobela.local>", ...mail });
    return;
  }
  const resend = await getResendClient();
  if (!resend) {
    console.log(`[email] Resend not configured, skipping email to ${mail.to}: ${mail.subject}`);
    return;
  }
  await resend.client.emails.send({ from: resend.from, ...mail });
}

/**
 * Fire-and-forget: a delivery failure shouldn't break signup or the
 * resend flow — it just logs.
 */
export async function sendVerificationEmail(to: string, { code, firstName }: { code: string; firstName: string }) {
  try {
    await deliver({
      to,
      subject: `${code} is your whobela verification code`,
      html: await render(VerificationCodeEmail({ code, firstName })),
    });
  } catch (err) {
    console.error("[email] Failed to send verification code", err);
  }
}

/**
 * Fire-and-forget: a delivery failure shouldn't break the forgot-password
 * flow — it just logs.
 */
export async function sendPasswordResetEmail(to: string, { code }: { code: string }) {
  try {
    await deliver({
      to,
      subject: `${code} is your whobela password reset code`,
      html: await render(PasswordResetEmail({ code })),
    });
  } catch (err) {
    console.error("[email] Failed to send password reset code", err);
  }
}

/**
 * Fire-and-forget: notification email failures shouldn't break the recipient's
 * response submission, so this never throws — it just logs.
 */
/** Minimal HTML escape — report text is attacker-controlled free text. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Notifies support that an abuse report was filed.
 *
 * Internal-only, so it is deliberately plain: no branding, nothing to click
 * through, everything needed to triage in the body. The report row is written
 * before this is called, so a delivery failure loses the notification, never the
 * report.
 */
export async function sendReportEmail({
  reportId,
  reason,
  details,
  pageUsername,
  reporterEmail,
}: {
  reportId: string;
  reason: string;
  details: string | null;
  pageUsername: string | null;
  reporterEmail: string | null;
}) {
  // Child-safety reports are marked in the subject so they are visible as such
  // in a mailbox list, without needing to be opened first.
  const urgent = reason === "CHILD_SAFETY";
  const subject = urgent
    ? `[CHILD SAFETY] whobela report — ${pageUsername ?? "unknown page"}`
    : `whobela report (${reason}) — ${pageUsername ?? "unknown page"}`;

  const rows: [string, string][] = [
    ["Reason", reason],
    ["Page", pageUsername ? `https://${pageUsername}.whobela.com` : "not identified"],
    ["Reporter", reporterEmail || "anonymous"],
    ["Report ID", reportId],
    ["Details", details || "(none given)"],
  ];

  try {
    await deliver({
      to: LEGAL.supportEmail,
      subject,
      html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
        ${urgent ? '<p style="font-weight:700;color:#a8202f">Child safety report — review before anything else.</p>' : ""}
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="vertical-align:top;color:#666">${k}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
            )
            .join("")}
        </table>
      </div>`,
    });
  } catch (err) {
    console.error("[email] Failed to send abuse-report notification", err);
  }
}

export async function sendNewResponseEmail(
  to: string,
  { recipientName, datePageName }: { recipientName: string; datePageName: string }
) {
  try {
    await deliver({
      to,
      subject: `${recipientName} said yes! ❤️`,
      html: await render(
        NewResponseEmail({ recipientName, datePageName, inboxUrl: `${getRootOrigin()}/dashboard/inbox` })
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send new-response notification", err);
  }
}
