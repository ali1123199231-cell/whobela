-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('HARASSMENT', 'IMPERSONATION', 'SEXUAL_CONTENT', 'CHILD_SAFETY', 'SPAM', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWED', 'ACTIONED', 'DISMISSED');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "datePageId" TEXT,
    "pageUsername" TEXT,
    "pageUrl" TEXT,
    "reason" "ReportReason" NOT NULL,
    "details" TEXT,
    "reporterEmail" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_status_createdAt_idx" ON "reports"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_datePageId_fkey" FOREIGN KEY ("datePageId") REFERENCES "date_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
