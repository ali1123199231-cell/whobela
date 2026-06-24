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

export async function getLiveDatePageByUsername(username: string): Promise<LiveDatePageResult> {
  const user = await loadDatePageWithOwner(username);
  if (!user || !user.datePage) return { state: "not-found" };

  const subscriptionActive = user.subscription?.status === "ACTIVE" || (await isShowcaseAccount(username));
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
