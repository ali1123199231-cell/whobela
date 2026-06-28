import Link from "next/link";
import type { BlogPost } from "@/content/blog";
import { BLOG_CATEGORIES } from "@/content/blog";
import { MarketingShell } from "./marketing-shell";
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  articleSchema,
} from "@/lib/seo/jsonld";

export function BlogPostView({ post }: { post: BlogPost }) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === post.categorySlug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: category?.name ?? "Articles", path: `/blog/${post.categorySlug}` },
    { name: post.h1, path: `/blog/${post.categorySlug}/${post.slug}` },
  ];

  return (
    <MarketingShell>
      <article className="mx-auto max-w-2xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-rose-500/80">
          <Link href="/blog" className="hover:text-rose-600">
            Blog
          </Link>
          <span className="mx-1.5">/</span>
          <Link href={`/blog/${post.categorySlug}`} className="hover:text-rose-600">
            {category?.name}
          </Link>
        </nav>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          {post.h1}
        </h1>
        <p className="mt-3 text-sm text-rose-500/80">
          By {post.author} ·{" "}
          {new Date(post.published).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Answer-first intro (AEO) */}
        <p className="mt-6 text-lg leading-relaxed text-rose-800/90">{post.intro}</p>

        {post.sections.map((section) => (
          <section key={section.heading} className="mt-9">
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
                      <strong className="font-semibold text-rose-950">{step.name}.</strong>{" "}
                      {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}

        {post.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-rose-950">
              Frequently asked questions
            </h2>
            <div className="mt-5 space-y-5">
              {post.faq.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-rose-950">{item.q}</h3>
                  <p className="mt-1.5 leading-relaxed text-rose-800/90">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Links UP to money pages */}
        <section className="mt-12 rounded-2xl bg-rose-50 p-6">
          <h2 className="text-lg font-semibold text-rose-950">Keep going</h2>
          <ul className="mt-3 space-y-2">
            {post.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-rose-600 hover:text-rose-700">
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-full bg-rose-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            Create your invitation
          </Link>
        </div>
      </article>

      {post.faq.length > 0 && <JsonLd data={faqSchema(post.faq)} />}
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          path: `/blog/${post.categorySlug}/${post.slug}`,
          authorName: post.author,
          published: post.published,
        })}
      />
    </MarketingShell>
  );
}
