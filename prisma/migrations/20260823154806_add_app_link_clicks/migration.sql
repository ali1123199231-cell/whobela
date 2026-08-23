-- CreateTable
CREATE TABLE "app_link_clicks" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_link_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_link_clicks_createdAt_idx" ON "app_link_clicks"("createdAt");
