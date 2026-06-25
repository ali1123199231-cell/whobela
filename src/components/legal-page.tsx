import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export function LegalPage({
  title,
  updated,
  backHref = "/legal",
  backLabel = "All legal documents",
  children,
}: {
  title: string;
  updated?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <Link
          href={backHref}
          className="text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          ← {backLabel}
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-sm text-rose-500/70">Last updated: {updated}</p>
        )}
        <div className="legal-content mt-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
