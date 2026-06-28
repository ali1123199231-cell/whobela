import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { JsonLd, softwareApplicationSchema, breadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata = buildMetadata({
  title: "Whobela Pricing — Start Free | Whobela",
  description:
    "Create your first date invitation for free. Upgrade for premium themes, music, custom domains, and more.",
  path: "/pricing",
});

const TIERS = [
  {
    name: "Free",
    tagline: "Everything you need to ask someone out.",
    features: [
      "Create a personalized invitation",
      "Share one private link",
      "Let them respond and schedule",
      "Core themes",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Premium",
    tagline: "Make it unforgettable.",
    features: [
      "All free features",
      "Premium themes & music",
      "Photo gallery & custom questions",
      "Connect a custom domain",
      "Priority support",
    ],
    cta: "Go Premium",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <header className="mx-auto max-w-3xl px-6 pb-2 pt-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          Simple pricing
        </h1>
        <p className="mt-5 text-lg text-rose-700/90">
          Start free. Upgrade when you want to make it extra special.
        </p>
      </header>

      <div className="mx-auto grid max-w-3xl gap-5 px-6 py-10 sm:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl border p-7 ${
              tier.highlight
                ? "border-rose-300 bg-white shadow-xl shadow-rose-100"
                : "border-rose-100 bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-rose-950">{tier.name}</h2>
            <p className="mt-1 text-rose-700/80">{tier.tagline}</p>
            <ul className="mt-5 space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2 text-rose-800/90">
                  <span className="text-rose-400">♥</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-7 block rounded-full px-6 py-3 text-center text-base font-semibold transition ${
                tier.highlight
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600"
                  : "border border-rose-200 text-rose-600 hover:bg-rose-50"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
    </MarketingShell>
  );
}
