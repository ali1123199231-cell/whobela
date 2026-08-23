import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { playStoreUrl } from "@/lib/app-store";
import { log } from "@/lib/log";

/**
 * The only link to Google Play the website hands out.
 *
 * Every badge points here instead of straight at the store, so a tap can be
 * counted before it leaves. Done as a redirect rather than a click handler on
 * purpose: it needs no JavaScript, survives an ad blocker, and — unlike a
 * beacon or a pixel — writes nothing whatsoever into the visitor's browser.
 * That keeps the promise /legal/cookies makes, that Whobela runs no analytics
 * service and sets nothing requiring consent. The row it writes is anonymous
 * and never leaves our own database.
 *
 * The redirect must never fail. If the insert throws, the visitor still gets
 * to the store — losing a number is a much smaller problem than a dead button.
 */

// The surfaces allowed to be counted. A crafted ?s= is redirected like any
// other but not recorded, so nobody can fill the table with invented labels.
const SOURCES: Record<string, string> = {
  bar: "marketing_bar",
  footer: "site_footer",
  post_publish: "post_publish",
  settings: "app_settings",
};

// Enough to keep crawlers out of the numbers. /go/ is disallowed in robots.txt
// as well, but the polite crawlers are not the ones that would skew a count.
const BOT = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|curl|wget|python-requests/i;

function platformOf(userAgent: string): string {
  if (/android/i.test(userAgent)) return "android";
  // iPadOS reports as Macintosh with touch, so this undercounts iPad slightly.
  // Worth it: the alternative is client-side probing, which needs JavaScript.
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  if (/windows|macintosh|cros|x11|linux/i.test(userAgent)) return "desktop";
  return "other";
}

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("s") ?? "";
  const medium = SOURCES[requested];
  const userAgent = request.headers.get("user-agent") ?? "";

  if (medium && !BOT.test(userAgent)) {
    const platform = platformOf(userAgent);
    try {
      await prisma.appLinkClick.create({ data: { source: requested, platform } });
      log.info("app.link.click", { source: requested, platform });
    } catch (failure) {
      // Counted nothing, but the visitor is still going to the store.
      log.warn("app.link.click.failed", { source: requested, message: (failure as Error).message });
    }
  }

  // 302 rather than 308: this is a counted hop, not a statement that the badge
  // has permanently moved, and it must not be cached by anything in between.
  return NextResponse.redirect(playStoreUrl(medium ?? "unknown"), {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
