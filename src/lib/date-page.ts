import { prisma } from "@/lib/prisma";
import type { DatePage } from "@/generated/prisma/client";
import { getLiveStatus } from "@/lib/date-page-status";

export * from "@/lib/date-page-status";

export type LiveDatePageResult =
  | { state: "not-found" }
  | {
      state: "live";
      datePage: DatePage;
      firstName: string;
      photoMediaIds: string[];
      ownerUserId: string;
    };

async function loadDatePageWithOwner(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      datePage: true,
      media: { where: { kind: "PROFILE_PHOTO" }, orderBy: { order: "asc" } },
    },
  });
  if (!user || !user.datePage) return null;
  return user;
}

export async function getLiveDatePageByUsername(username: string): Promise<LiveDatePageResult> {
  const user = await loadDatePageWithOwner(username);
  if (!user || !user.datePage) return { state: "not-found" };
  if (!getLiveStatus(user.datePage).isLive) return { state: "not-found" };

  return {
    state: "live",
    datePage: user.datePage,
    firstName: user.profile?.firstName ?? "",
    photoMediaIds: user.media.map((m) => m.id),
    ownerUserId: user.id,
  };
}
