-- AlterTable
ALTER TABLE "users" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "verificationCodeHash" TEXT;
ALTER TABLE "users" ADD COLUMN "verificationCodeExpiresAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "verificationCodeSentAt" TIMESTAMP(3);

-- Grandfather every account that existed before email verification shipped,
-- so nobody already using the app gets locked out. New signups are created
-- with emailVerifiedAt left NULL and go through /verify-email.
UPDATE "users" SET "emailVerifiedAt" = "createdAt" WHERE "emailVerifiedAt" IS NULL;
