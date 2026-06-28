import Link from "next/link";
import type { SeoPage } from "@/content/types";
import { MarketingShell } from "./marketing-shell";
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  howToSchema,
  softwareApplicationSchema,
} from "@/lib/seo/jsonld";

// Known section hubs so derived breadcrumbs link to a real index page.
const HUBS: Record<string, string> = {
  templates: "Templates",
  "date-ideas": "Date ideas",
  questions: "How to ask",
  tools: "Tools",
  blog: "Blog",
};

function deriveBreadcrumb(page: SeoPage): { name: string; path: string }[] {
  const crumbs = [{ name: "Home", path: "/" }];
  const first = page.path.split("/").filter(Boolean)[0];
  if (first && HUBS[first] && `/${first}` !== page.path) {
    crumbs.push({ name: HUBS[first], path: `/${first}` });
  }
  crumbs.push({ name: page.h1, path: page.path });
  return crumbs;
}

function CtaButtons() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link
        href="/signup"
        className="rounded-full bg-rose-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
      >
        Create your invitation
      </Link>
      <Link
        href="/templates"
        className="rounded-full border border-rose-200 bg-white px-8 py-3 text-base font-semibold text-rose-600 transition hover:bg-rose-50"
      >
        Browse templates
      </Link>
    </div>
  );
}

/** Renders any SeoPage: hero, sections, FAQ, related links, CTA, and JSON-LD. */
export function SeoPageView({ page }: { page: SeoPage }) {
  const breadcrumb = page.breadcrumb ?? deriveBreadcrumb(page);
  return (
    <MarketingShell>
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-3xl px-6 pt-8 text-sm text-rose-500/80"
      >
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.path}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {i < breadcrumb.length - 1 ? (
              <Link href={crumb.path} className="hover:text-rose-600">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-rose-700">{crumb.name}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 pb-6 pt-6 text-center">
        {page.eyebrow && (
          <span className="mb-4 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
            {page.eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          {page.h1}
        </h1>
        {/* Answer-first intro (AEO) */}
        <p className="mt-6 text-lg leading-relaxed text-rose-700/90">{page.intro}</p>
        <CtaButtons />
      </header>

      {/* Body sections */}
      <article className="mx-auto max-w-3xl px-6 py-10">
        {page.sections.map((section) => (
          <section key={section.heading} className="mt-10 first:mt-0">
            <h2 className="text-2xl font-semibold tracking-tight text-rose-950">
              {section.heading}
            </h2>
            {section.body?.map((para, i) => (
              <p key={i} className="mt-4 leading-relaxed text-rose-800/90">
                {para}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-rose-800/90">
                    <span className="text-rose-400">♥</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.steps && (
              <ol className="mt-4 space-y-3">
                {section.steps.map((step, i) => (
                  <li key={step.name} className="flex gap-3 text-rose-800/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-600">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="font-semibold text-rose-950">
                        {step.name}.
                      </strong>{" "}
                      {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}

        {/* FAQ */}
        {page.faq.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight text-rose-950">
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-5">
              {page.faq.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-rose-950">{item.q}</h3>
                  <p className="mt-1.5 leading-relaxed text-rose-800/90">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related internal links */}
        {page.related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight text-rose-950">
              Keep exploring
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {page.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border border-rose-100 bg-white px-4 py-3 text-rose-700 transition hover:border-rose-200 hover:text-rose-600"
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* CTA band */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 px-8 py-12 text-center text-white shadow-xl shadow-rose-200">
          <h2 className="text-2xl font-semibold">{page.cta.heading}</h2>
          {page.cta.sub && <p className="mt-3 text-rose-50/90">{page.cta.sub}</p>}
          <Link
            href="/signup"
            className="mt-7 inline-block rounded-full bg-white px-8 py-3 text-base font-semibold text-rose-600 shadow-lg transition hover:bg-rose-50"
          >
            Create your invitation
          </Link>
        </div>
      </section>

      {/* Structured data */}
      {page.faq.length > 0 && <JsonLd data={faqSchema(page.faq)} />}
      <JsonLd data={breadcrumbSchema(breadcrumb)} />
      {page.extraSchema?.includes("product") && (
        <JsonLd data={softwareApplicationSchema()} />
      )}
      {page.extraSchema?.includes("howto") && page.howToSteps && (
        <JsonLd data={howToSchema(page.howToName ?? page.h1, page.howToSteps)} />
      )}
    </MarketingShell>
  );
}
