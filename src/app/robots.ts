import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";

// §2/§10 — allow marketing; block app, API, and the private invitation
// surfaces (belt-and-suspenders alongside per-page noindex on /r and /preview).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/preview/", "/r/", "/delete-account", "/privacy-settings"],
    },
    sitemap: siteUrl("/sitemap.xml"),
    host: siteUrl("/"),
  };
}
