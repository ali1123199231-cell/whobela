-- CreateTable
CREATE TABLE "billing_click_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "SubscriptionProvider" NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_click_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "billing_click_events" ADD CONSTRAINT "billing_click_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
