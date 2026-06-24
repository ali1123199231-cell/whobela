import { prisma } from "@/lib/prisma";
import type { DatePage } from "@/generated/prisma/client";
import { getLiveStatus } from "@/lib/date-page-status";
import { isShowcaseAccount } from "@/lib/showcase";

export * from "@/lib/date-page-status";

export type LiveDatePageResult =
  | { state: "not-found" }
  | { state: "expired" }
  | {
      state: "live";
      datePage: DatePage;
      firstName: string;
      photoMediaIds: string[];
      ownerUserId: string;
      trialEndsAt: Date | null;
    };

async function loadDatePageWithOwner(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      datePage: true,
      media: { where: { kind: "PROFILE_PHOTO" }, orderBy: { order: "asc" } },
      subscription: true,
    },
  });
  if (!user || !user.datePage) return null;
  return user;
}

// Only ever true outside production (see /api/billing/status) — exported so
// it actually does what its name/UI copy claims everywhere subscription
// status feeds into the live/expired gate, instead of just affecting the
// billing dashboard's display while pages still expire on the real
// 30-minute trial underneath it.
export function isBillingBypassed() {
  return process.env.BILLING_BYPASS === "true" && process.env.APP_ENV !== "production";
}

export async function getLiveDatePageByUsername(username: string): Promise<LiveDatePageResult> {
  const user = await loadDatePageWithOwner(username);
  if (!user || !user.datePage) return { state: "not-found" };

  const subscriptionActive =
    isBillingBypassed() || user.subscription?.status === "ACTIVE" || (await isShowcaseAccount(username));
  const { isLive, trialEndsAt } = getLiveStatus(user.datePage, subscriptionActive);

  if (user.datePage.status !== "PUBLISHED") return { state: "not-found" };
  if (!isLive) return { state: "expired" };

  return {
    state: "live",
    datePage: user.datePage,
    firstName: user.profile?.firstName ?? "",
    photoMediaIds: user.media.map((m) => m.id),
    ownerUserId: user.id,
    trialEndsAt,
  };
}
