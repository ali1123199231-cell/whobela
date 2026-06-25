import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Legal — whobela",
  description: "Whobela's terms, privacy policy, and other legal documents.",
};

const documents = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/refund-policy", label: "Refund Policy" },
  { href: "/legal/community-guidelines", label: "Community Guidelines" },
  { href: "/legal/safety", label: "Safety Policy" },
  { href: "/legal/content-removal", label: "Content Removal Policy" },
  { href: "/legal/dpa", label: "Data Processing Agreement (DPA)" },
  { href: "/legal/subscription-terms", label: "Subscription Terms" },
  { href: "/legal/custom-domain-terms", label: "Custom Domain Terms" },
  { href: "/legal/ai-disclosure", label: "AI / Automation Disclosure" },
  { href: "/legal/accessibility", label: "Accessibility Statement" },
];

const more = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help Center" },
  { href: "/report-abuse", label: "Report Abuse" },
  { href: "/delete-account", label: "Delete Account" },
  { href: "/privacy-settings", label: "Privacy Settings" },
];

export default function LegalIndexPage() {
  return (
    <>
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <Link href="/" className="text-sm font-medium text-rose-600 hover:text-rose-700">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
        Legal
      </h1>
      <p className="mt-3 text-rose-700/80">
        Everything about how whobela works, your rights, and your data.
      </p>

      <ul className="mt-8 divide-y divide-rose-100 rounded-2xl border border-rose-100 bg-white">
        {documents.map((doc) => (
          <li key={doc.href}>
            <Link
              href={doc.href}
              className="block px-5 py-4 text-rose-900 transition hover:bg-rose-50"
            >
              {doc.label}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-semibold text-rose-950">More</h2>
      <ul className="mt-4 divide-y divide-rose-100 rounded-2xl border border-rose-100 bg-white">
        {more.map((doc) => (
          <li key={doc.href}>
            <Link
              href={doc.href}
              className="block px-5 py-4 text-rose-900 transition hover:bg-rose-50"
            >
              {doc.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
    <SiteFooter />
    </>
  );
}
