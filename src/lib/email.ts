import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";
import { render } from "@react-email/render";
import { getConfig, getConfigMany, CONFIG_KEYS, getRootOrigin } from "@/lib/config";
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
