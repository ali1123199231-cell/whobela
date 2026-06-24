import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateVerificationCode } from "@/lib/email-verification";
import type { User } from "@/generated/prisma/client";

const CODE_EXPIRY_MS = 15 * 60 * 1000;
export const RESET_RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_RESET_ATTEMPTS = 5;

export async function sendPasswordResetCode(user: Pick<User, "id" | "email">) {
  const code = generateVerificationCode();
  const resetCodeHash = await hashPassword(code);
  const now = new Date();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetCodeHash,
      resetCodeExpiresAt: new Date(now.getTime() + CODE_EXPIRY_MS),
      resetCodeSentAt: now,
      resetCodeAttempts: 0,
    },
  });
  await sendPasswordResetEmail(user.email, { code });
}
