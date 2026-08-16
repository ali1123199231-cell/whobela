import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";
import { indexableUrls } from "@/lib/seo/urls";

// §10 — programmatic sitemap. Excludes /r, /preview, /dashboard, /api and any
// programmatic page still behind the noindex quality gate.
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableUrls().map((entry) => ({
    url: siteUrl(entry.path),
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
