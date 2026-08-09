import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { JsonLd, softwareApplicationSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/jsonld";

export const metadata = buildMetadata({
  title: "Whobela Pricing — Free, Forever | Whobela",
  description:
    "Whobela is free. Create your date invitation, share the link, connect your own domain, and keep the page online for as long as you like. No card, no plan, no expiry.",
  path: "/pricing",
});

const INCLUDED = [
  "Create a personalized invitation",
  "Every theme, no locked ones",
  "Photo gallery and custom questions",
  "Share your private link",
  "Your page stays online — no countdown, no expiry",
  "Let them respond and pick a date",
  "Responses delivered to your inbox",
  "Connect your own custom domain",
];

const FAQ = [
  {
    q: "Is Whobela really free?",
    a: "Yes. Every feature is free, including custom domains. We don't ask for a card and there is no paid plan to upgrade to.",
  },
  {
    q: "How long does my page stay online?",
    a: "For as long as you keep it published. There is no trial window — unpublish it yourself whenever you're done.",
  },
  {
    q: "Will you start charging later?",
    a: "If we ever add paid features they'll be additions alongside what's free today. We won't put a page you've already published behind a payment.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <header className="mx-auto max-w-3xl px-6 pb-2 pt-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          Free. All of it.
        </h1>
        <p className="mt-5 text-lg text-rose-700/90">
          Asking someone out is nerve-racking enough without a paywall in the middle of it. There
          is no plan to pick and no card to enter.
        </p>
      </header>

      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="rounded-3xl border border-rose-300 bg-white p-8 shadow-xl shadow-rose-100">
          <p className="text-5xl font-semibold text-rose-950">$0</p>
          <p className="mt-2 text-rose-700/80">Everything, for everyone.</p>

          <ul className="mt-6 space-y-2">
            {INCLUDED.map((f) => (
              <li key={f} className="flex gap-2 text-rose-800/90">
                <span className="text-rose-400">♥</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="mt-8 block rounded-full bg-rose-500 px-6 py-3 text-center text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            Create your invitation
          </Link>
          <p className="mt-3 text-center text-sm text-rose-700/60">No credit card required.</p>
        </div>
      </div>

      <section className="mx-auto max-w-xl px-6 pb-14">
        <h2 className="text-xl font-semibold text-rose-950">Questions</h2>
        <dl className="mt-4 space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-medium text-rose-900">{item.q}</dt>
              <dd className="mt-1 text-rose-700/80">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
    </MarketingShell>
  );
}
