import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import type { User } from "@/generated/prisma/client";

const CODE_EXPIRY_MS = 15 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_CODE_ATTEMPTS = 5;

export function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendVerificationCode(user: Pick<User, "id" | "email">, firstName: string) {
  const code = generateVerificationCode();
  const verificationCodeHash = await hashPassword(code);
  const now = new Date();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationCodeHash,
      verificationCodeExpiresAt: new Date(now.getTime() + CODE_EXPIRY_MS),
      verificationCodeSentAt: now,
      verificationCodeAttempts: 0,
    },
  });
  await sendVerificationEmail(user.email, { code, firstName });
}
