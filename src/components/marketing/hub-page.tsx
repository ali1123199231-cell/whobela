import Link from "next/link";
import { MarketingShell } from "./marketing-shell";

export type HubItem = {
  href: string;
  title: string;
  description?: string;
  emoji?: string;
};

/** Generic listing page for templates, date ideas, tools, blog, etc. */
export function HubPage({
  eyebrow,
  h1,
  intro,
  items,
  columns = 2,
}: {
  eyebrow?: string;
  h1: string;
  intro: string;
  items: HubItem[];
  columns?: 2 | 3;
}) {
  return (
    <MarketingShell>
      <header className="mx-auto max-w-3xl px-6 pb-4 pt-12 text-center">
        {eyebrow && (
          <span className="mb-4 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          {h1}
        </h1>
        <p className="mt-5 text-lg text-rose-700/90">{intro}</p>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <ul
          className={`grid gap-4 ${
            columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col rounded-2xl border border-rose-100 bg-white p-5 transition hover:border-rose-200 hover:shadow-md hover:shadow-rose-100"
              >
                <span className="text-2xl">{item.emoji ?? "💌"}</span>
                <span className="mt-3 font-semibold text-rose-950">{item.title}</span>
                {item.description && (
                  <span className="mt-1.5 text-sm leading-relaxed text-rose-700/80">
                    {item.description}
                  </span>
                )}
                <span className="mt-4 text-sm font-medium text-rose-500">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
