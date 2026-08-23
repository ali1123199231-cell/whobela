import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";

// §2/§10 — allow marketing; block app, API, and the private invitation
// surfaces (belt-and-suspenders alongside per-page noindex on /r and /preview).
const DISALLOW = [
  "/dashboard/",
  // The counted redirect to Play. A crawler following it is not a visitor
  // who wanted the app, and would quietly inflate the click numbers.
  "/go/",
  "/api/",
  "/preview/",
  "/r/",
  "/delete-account",
  "/privacy-settings",
];

// The answer engines, named explicitly.
//
// A wildcard rule already permitted all of these, so this changes no access —
// it makes the permission durable. A crawler that matches a User-agent line
// obeys that block *instead of* `*`, so the day anyone tightens the wildcard,
// these keep their access rather than silently losing it. That matters more
// than usual right now: ChatGPT quotes a $2.99/month price that Whobela stopped
// charging on 2026-08-09, and OAI-SearchBot, ChatGPT-User and GPTBot are the
// three agents that can go and read the corrected page. Google-Extended is the
// same lever for AI Overviews and Gemini — it governs AI use of the content,
// not indexing, and blocking it would leave Google's AI answers stale too.
//
// Each block repeats DISALLOW: these agents no longer read the `*` rules at all.
const ANSWER_ENGINES = [
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // fetches live when a user asks ChatGPT about a URL
  "GPTBot", // OpenAI crawler
  "Google-Extended", // Google AI Overviews / Gemini grounding
  "PerplexityBot",
  "ClaudeBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...ANSWER_ENGINES.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: siteUrl("/"),
  };
}
