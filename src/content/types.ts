// Shared content model. Every SEO long-form page (money, template, audience,
// occasion, comparison, date-idea, question) is described by one SeoPage object
// and rendered by <SeoPageView>. This keeps content data separate from layout
// and makes the whole surface auditable in one place.

export type FaqItem = { q: string; a: string };

export type ContentSection = {
  heading: string;
  /** One or more paragraphs. */
  body?: string[];
  /** Optional bullet list rendered under the body. */
  bullets?: string[];
  /** Optional ordered (numbered) list. */
  steps?: { name: string; text: string }[];
};

export type RelatedLink = { href: string; label: string };

export type SeoPage = {
  /** Full canonical path, e.g. "/templates/coffee-date". */
  path: string;
  /** URL slug (last segment) for dynamic routes. */
  slug: string;
  title: string; // <title>
  description: string; // meta description
  h1: string;
  /** Answer-first opening paragraph (~40-60 words) — important for AEO. */
  intro: string;
  /** Eyebrow label shown above H1. */
  eyebrow?: string;
  sections: ContentSection[];
  faq: FaqItem[];
  cta: { heading: string; sub?: string };
  /** Optional explicit breadcrumb; derived from `path` when omitted. */
  breadcrumb?: { name: string; path: string }[];
  primaryKeyword: string;
  related: RelatedLink[];
  /** Programmatic quality gate — true until the page earns impressions. */
  noindex?: boolean;
  /** Extra schema to emit beyond FAQPage + Breadcrumb. */
  extraSchema?: ("howto" | "product")[];
  /** For HowTo schema, supply the steps explicitly. */
  howToName?: string;
  howToSteps?: { name: string; text: string }[];
};
