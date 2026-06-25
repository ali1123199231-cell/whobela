import Link from "next/link";

const columns = [
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/help", label: "Help Center" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms & Conditions" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/cookies", label: "Cookie Policy" },
      { href: "/legal/refund-policy", label: "Refund Policy" },
      { href: "/legal/subscription-terms", label: "Subscription Terms" },
      { href: "/legal/custom-domain-terms", label: "Custom Domain Terms" },
      { href: "/legal/dpa", label: "Data Processing Agreement" },
      { href: "/legal/ai-disclosure", label: "AI / Automation Disclosure" },
      { href: "/legal/accessibility", label: "Accessibility Statement" },
    ],
  },
  {
    heading: "Community & Safety",
    links: [
      { href: "/legal/community-guidelines", label: "Community Guidelines" },
      { href: "/legal/safety", label: "Safety Policy" },
      { href: "/legal/content-removal", label: "Content Removal Policy" },
      { href: "/report-abuse", label: "Report Abuse" },
    ],
  },
  {
    heading: "Your Account",
    links: [
      { href: "/privacy-settings", label: "Privacy Settings" },
      { href: "/delete-account", label: "Delete Account" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rose-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-semibold text-rose-950">{column.heading}</h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-rose-700/80 hover:text-rose-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rose-100 pt-6 text-sm text-rose-500/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} whobela.com. All rights reserved.</p>
          <Link href="/legal" className="font-medium text-rose-600 hover:text-rose-700">
            All legal documents →
          </Link>
        </div>
      </div>
    </footer>
  );
}
