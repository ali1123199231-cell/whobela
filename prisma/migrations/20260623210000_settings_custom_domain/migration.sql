-- AlterTable
ALTER TABLE "users" ADD COLUMN "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "date_pages" ADD COLUMN "customDomain" TEXT;
ALTER TABLE "date_pages" ADD COLUMN "customDomainVerifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "date_pages_customDomain_key" ON "date_pages"("customDomain");
