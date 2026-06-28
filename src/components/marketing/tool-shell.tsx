import Link from "next/link";
import { MarketingShell } from "./marketing-shell";
import { JsonLd, breadcrumbSchema, softwareApplicationSchema } from "@/lib/seo/jsonld";
import type { ToolDef } from "@/content/tools";

/** Server wrapper for an interactive tool: hero, the tool UI, CTA, schema. */
export function ToolShell({ tool, children }: { tool: ToolDef; children: React.ReactNode }) {
  return (
    <MarketingShell>
      <header className="mx-auto max-w-2xl px-6 pb-2 pt-12 text-center">
        <span className="mb-4 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          {tool.emoji} Free tool
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          {tool.h1}
        </h1>
        <p className="mt-5 text-lg text-rose-700/90">{tool.intro}</p>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">{children}</div>

      <section className="mx-auto max-w-2xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 px-8 py-10 text-center text-white shadow-xl shadow-rose-200">
          <h2 className="text-xl font-semibold">Ready to actually ask them?</h2>
          <p className="mt-2 text-rose-50/90">
            Turn any idea into a personalized invitation in minutes.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-base font-semibold text-rose-600 shadow-lg transition hover:bg-rose-50"
          >
            Create your invitation
          </Link>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ])}
      />
      <JsonLd data={softwareApplicationSchema()} />
    </MarketingShell>
  );
}
