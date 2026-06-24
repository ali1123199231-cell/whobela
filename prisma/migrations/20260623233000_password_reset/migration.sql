-- AlterTable
ALTER TABLE "users" ADD COLUMN "resetCodeHash" TEXT;
ALTER TABLE "users" ADD COLUMN "resetCodeExpiresAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "resetCodeSentAt" TIMESTAMP(3);
