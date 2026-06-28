import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { BLOG_CATEGORIES, BLOG_POSTS, postsInCategory } from "@/content/blog";

export const metadata = buildMetadata({
  title: "The Whobela Blog — Asking Out, Date Ideas & Romance",
  description:
    "Confidence, scripts, date ideas, and modern romance. The Whobela blog helps you ask someone out and plan dates they'll remember.",
  path: "/blog",
});

export default function BlogHub() {
  return (
    <MarketingShell>
      <header className="mx-auto max-w-3xl px-6 pb-4 pt-12 text-center">
        <span className="mb-4 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          The Whobela Blog
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          Ask better. Date better.
        </h1>
        <p className="mt-5 text-lg text-rose-700/90">
          Real, warm advice on asking someone out, planning dates, and keeping romance alive.
        </p>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-8">
        {BLOG_CATEGORIES.map((cat) => (
          <section key={cat.slug} className="mt-10 first:mt-0">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-rose-950">
                {cat.name}
              </h2>
              <Link
                href={`/blog/${cat.slug}`}
                className="text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                View all →
              </Link>
            </div>
            <p className="mt-1 text-rose-700/80">{cat.blurb}</p>
            <ul className="mt-4 space-y-2">
              {postsInCategory(cat.slug).map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.categorySlug}/${post.slug}`}
                    className="block rounded-xl border border-rose-100 bg-white px-4 py-3 text-rose-800 transition hover:border-rose-200 hover:text-rose-600"
                  >
                    {post.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-12 text-center text-sm text-rose-500/70">
          {BLOG_POSTS.length} articles and counting.
        </p>
      </div>
    </MarketingShell>
  );
}
