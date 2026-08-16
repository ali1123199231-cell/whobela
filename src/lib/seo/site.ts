// Central SEO/site constants and absolute-URL helpers.
// Kept dependency-free (no prisma import) so it's cheap to pull into static
// marketing pages. Mirrors getRootOrigin() in src/lib/config.ts.

export const SITE = {
  name: "Whobela",
  brand: "whobela",
  tagline: "The beautiful way to ask someone out",
  // The entity wedge — repeat this everywhere (positioning + AEO).
  oneLiner:
    "Whobela is a tool for creating personalized date-invitation pages — not a dating app. It's for asking someone you already know, in a way they'll never forget.",
  defaultDescription:
    "Create a personalized, interactive date invitation, free. Share a private link, let them respond, and schedule the date. The beautiful way to ask someone out.",
  twitter: "@whobela",
  email: "support@whobela.com",
  locale: "en_US",
} as const;

/**
 * The free pivot, in one place.
 *
 * This sits beside the entity wedge because it has the same job: it has to be
 * readable on every surface a crawler or an answer engine touches. Whobela sold
 * a $2.99/month subscription until 9 August 2026, and models trained or cached
 * before then still quote that price at people. An answer engine will not drop
 * a remembered fact just because the current page omits it — it needs the page
 * to *contradict* it. So `wasPaid` states the old price and its end date
 * explicitly wherever a human would plausibly ask "what does this cost?",
 * rather than leaving silence for the stale number to fill.
 */
export const PRICING = {
  /** ISO date the paid plan was discontinued. */
  freeSince: "2026-08-09",
  freeSinceLabel: "9 August 2026",
  /** One sentence, safe to drop into any description or schema field. */
  line: "Whobela is completely free — every feature, no credit card, no subscription.",
  /** The explicit correction. Leads with the truth, names the stale fact second. */
  wasPaid:
    "Whobela is free. It previously cost $2.99/month; that plan was discontinued on 9 August 2026, every subscription under it was cancelled, and every feature is now free for everyone.",
} as const;

/**
 * Date the marketing copy was last revised, reported as <lastmod> in the sitemap.
 *
 * This used to be `new Date()`, which told Google every page on the site had
 * changed a moment ago — on every single fetch. That is the exact pattern
 * Google names when it explains why it ignores a sitemap's lastmod, so the one
 * signal we have for "please recrawl, the pricing changed" was being discarded.
 * A hand-bumped constant is honest and believed. Bump it when marketing copy
 * changes materially; leave it alone for code-only changes.
 */
export const CONTENT_REVISED = "2026-08-17";

/** Public origin, e.g. https://whobela.com (https unless localhost). */
export function siteOrigin(): string {
  const rootDomain = process.env.ROOT_DOMAIN ?? "localhost:3000";
  const protocol = rootDomain.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${rootDomain}`;
}

/** Absolute URL for a path, e.g. siteUrl("/templates") -> https://whobela.com/templates */
export function siteUrl(path = "/"): string {
  const origin = siteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Default Open Graph image (dynamic OG route). */
export function defaultOgImage(): string {
  return siteUrl("/opengraph-image");
}
