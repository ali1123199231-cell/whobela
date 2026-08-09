-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gclid" TEXT,
ADD COLUMN     "signupLandingPath" TEXT,
ADD COLUMN     "signupReferrer" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmTerm" TEXT;
