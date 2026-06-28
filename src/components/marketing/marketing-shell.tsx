import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

const NAV = [
  { href: "/create-date-invitation", label: "Create" },
  { href: "/templates", label: "Templates" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
];

/** Shared header + footer wrapper for all marketing/SEO pages. */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-base font-semibold text-rose-600">
            🌸 whobela
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-rose-700/80 transition hover:text-rose-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/signup"
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-600"
          >
            Create yours
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-b from-rose-50 via-white to-pink-50">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
