import { notFound } from "next/navigation";
import { getLiveDatePageByUsername } from "@/lib/date-page";
import { getSession } from "@/lib/auth";
import { siteUrl } from "@/lib/seo/site";
import { LiveDatePageView } from "./live-date-page-view";

// Tagged so the badge's traffic shows up in the same first-touch attribution
// every other channel lands in (see src/lib/attribution.ts) — this is the one
// number that says whether giving pages away is buying us growth.
const BADGE_URL = "/?utm_source=whobela&utm_medium=page_badge&utm_campaign=viral_loop";

// The CTA shown after someone has answered. Tagged apart from the badge
// because the two are asked at completely different moments — one is a corner
// mark on the page, the other is offered to somebody who has just said yes —
// and knowing which one actually brings people back is worth the extra param.
const CTA_URL = "/?utm_source=whobela&utm_medium=page_cta&utm_campaign=viral_loop";

export async function PublicDatePage({ username }: { username: string }) {
  const result = await getLiveDatePageByUsername(username);
  if (result.state === "not-found") notFound();

  const session = await getSession();
  const isOwner = session?.userId === result.ownerUserId;

  return (
    <LiveDatePageView
      datePageId={result.datePage.id}
      config={result.datePage}
      photoUrls={result.photoMediaIds.map((id) => `/api/media/${id}`)}
      isOwner={isOwner}
      homeUrl={siteUrl(BADGE_URL)}
      ctaUrl={siteUrl(CTA_URL)}
      username={username}
    />
  );
}
