// Central registry of public marketing URLs, used by sitemap.ts and for
// internal-link sanity. Private/app routes (/r, /preview, /dashboard, /api)
// are intentionally excluded.

import { MONEY_PAGE_SLUGS } from "@/content/money-pages";
import { TEMPLATE_SLUGS } from "@/content/templates";
import { AUDIENCE_SLUGS } from "@/content/audiences";
import { OCCASION_SLUGS } from "@/content/occasions";
import { COMPARISON_SLUGS } from "@/content/comparisons";
import { DATE_IDEA_PAGES } from "@/content/date-ideas";
import { QUESTION_PAGES } from "@/content/questions";
import { TOOL_SLUGS } from "@/content/tools";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/content/blog";

export type UrlEntry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  /** Programmatic pages start noindex; excluded from the sitemap until promoted. */
  indexable: boolean;
};

export function indexableUrls(): UrlEntry[] {
  const urls: UrlEntry[] = [];

  // Core
  urls.push({ path: "/", changeFrequency: "weekly", priority: 1.0, indexable: true });
  for (const p of ["/templates", "/tools", "/blog", "/date-ideas", "/questions", "/faq", "/pricing", "/about", "/help", "/contact"]) {
    urls.push({ path: p, changeFrequency: "weekly", priority: 0.6, indexable: true });
  }

  // Money pages
  for (const slug of MONEY_PAGE_SLUGS) {
    urls.push({ path: `/${slug}`, changeFrequency: "monthly", priority: 0.9, indexable: true });
  }
  // Templates
  for (const slug of TEMPLATE_SLUGS) {
    urls.push({ path: `/templates/${slug}`, changeFrequency: "monthly", priority: 0.7, indexable: true });
  }
  // Audiences
  for (const slug of AUDIENCE_SLUGS) {
    urls.push({ path: `/for/${slug}`, changeFrequency: "monthly", priority: 0.7, indexable: true });
  }
  // Occasions
  for (const slug of OCCASION_SLUGS) {
    urls.push({ path: `/occasions/${slug}`, changeFrequency: "monthly", priority: 0.7, indexable: true });
  }
  // Comparisons
  for (const slug of COMPARISON_SLUGS) {
    urls.push({ path: `/vs/${slug}`, changeFrequency: "monthly", priority: 0.6, indexable: true });
  }
  // Tools
  for (const slug of TOOL_SLUGS) {
    urls.push({ path: `/tools/${slug}`, changeFrequency: "monthly", priority: 0.6, indexable: true });
  }
  // Blog categories + posts
  for (const cat of BLOG_CATEGORIES) {
    urls.push({ path: `/blog/${cat.slug}`, changeFrequency: "weekly", priority: 0.5, indexable: true });
  }
  for (const post of BLOG_POSTS) {
    urls.push({ path: `/blog/${post.categorySlug}/${post.slug}`, changeFrequency: "monthly", priority: 0.6, indexable: true });
  }

  // Programmatic pages: included only when their SeoPage is no longer noindex
  // (the quality gate — promote winners by flipping `noindex`).
  for (const page of Object.values(DATE_IDEA_PAGES)) {
    if (!page.noindex) urls.push({ path: page.path, changeFrequency: "monthly", priority: 0.4, indexable: true });
  }
  for (const page of Object.values(QUESTION_PAGES)) {
    if (!page.noindex) urls.push({ path: page.path, changeFrequency: "monthly", priority: 0.4, indexable: true });
  }

  return urls;
}
