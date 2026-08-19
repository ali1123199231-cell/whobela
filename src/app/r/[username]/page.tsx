import type { Metadata } from "next";
import { headers } from "next/headers";
import { PublicDatePage } from "@/components/date-page/public-page";
import { getLiveDatePageByUsername } from "@/lib/date-page";
import { withDefaults, DEFAULT_INVITE_CONFIG } from "@/lib/date-page-defaults";

/**
 * The origin this request actually arrived on, so a page served on a connected
 * custom domain identifies itself by that domain rather than by whobela.com.
 * The page is noindex either way, so this is about the link the recipient sees
 * unfurled in a DM, not about search ranking.
 */
async function requestOrigin(username: string): Promise<{ origin: string; path: string }> {
  const rootDomain = (process.env.ROOT_DOMAIN ?? "localhost:3000").toLowerCase();
  const host = ((await headers()).get("host") ?? rootDomain).toLowerCase();
  const isLocal = host === "localhost" || host.startsWith("localhost:") || host.includes(".localhost");
  const protocol = isLocal ? "http" : "https";
  // On the root domain the page really does live at /r/{username}; everywhere
  // else (a user subdomain or a custom domain) the proxy serves it at "/".
  const isRoot = host === rootDomain || host === `www.${rootDomain}`;
  return { origin: `${protocol}://${host}`, path: isRoot ? `/r/${username}` : "/" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { origin, path } = await requestOrigin(username);
  const result = await getLiveDatePageByUsername(username);
  if (result.state !== "live") {
    // Private invitation surface — never index (privacy + thin-content at scale).
    return {
      metadataBase: new URL(origin),
      title: "whobela — Create a magical way to ask someone out",
      robots: { index: false, follow: true },
      manifest: null,
    };
  }

  const invite = withDefaults(result.datePage.inviteConfig, DEFAULT_INVITE_CONFIG);
  const title = result.firstName ? `${result.firstName} has something to ask you 💌` : invite.question;
  return {
    metadataBase: new URL(origin),
    alternates: { canonical: path },
    title,
    description: "Open this link to see your invitation ❤️",
    // Private invitation addressed to one recipient: keep it out of search
    // results. The Open Graph image (opengraph-image.tsx) still works for
    // social/DM unfurls, which ignore the robots directive.
    robots: { index: false, follow: true },
    // These are served from {username}.whobela.com, where the proxy rewrites
    // every path to this route — so the root layout's manifest link would 404
    // and log an error on the one page it matters most that nothing does.
    // Suppressed rather than routed around: the recipient of an invitation is
    // not who the installable app is for.
    manifest: null,
  };
}

export default async function PublicSitePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <PublicDatePage username={username} />;
}
