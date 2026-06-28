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
    "Create a personalized, interactive date invitation. Share a private link, let them respond, and schedule the date. The beautiful way to ask someone out.",
  twitter: "@whobela",
  email: "support@whobela.com",
  locale: "en_US",
} as const;

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
