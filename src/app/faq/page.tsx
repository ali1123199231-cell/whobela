import { buildMetadata } from "@/lib/seo/metadata";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata = buildMetadata({
  title: "Whobela FAQ — How It Works, Privacy & Pricing",
  description:
    "Answers about Whobela: what it is, whether it's free, how private invitations are, and whether it's a dating app (it's not).",
  path: "/faq",
});

const FAQ = [
  { q: "What is Whobela?", a: "Whobela is a tool for creating personalized, interactive date-invitation pages. You build a page, share a private link, and the other person responds and helps schedule the date." },
  { q: "Is Whobela a dating app?", a: "No. Dating apps help you meet strangers. Whobela helps you ask someone you already know — a crush, a friend, your partner — on a date in a memorable way." },
  { q: "Is Whobela free?", a: "You can create and share your first invitation for free. Premium themes and features are available if you want more." },
  { q: "How do I create a romantic invitation?", a: "Pick a template, add your photos, music, and message, write your question, and share the private link Whobela generates." },
  { q: "Can I customize my invitation?", a: "Completely — themes, colors, photos, music, custom questions, and exactly what happens when they say yes." },
  { q: "Can I schedule a date?", a: "Yes. The person you're asking can pick a time right inside the invitation." },
  { q: "Is my invitation private?", a: "Yes. Only the person you send the link to can open it, and their responses are visible only to you. Private invitation pages are not indexed by search engines." },
  { q: "Do they need an account?", a: "No. They just open your link and respond — no signup, no app to download." },
  { q: "Can I use my own domain?", a: "Yes — you can connect a custom domain to your invitation. See our custom domain terms for details." },
  { q: "How long does it take to make one?", a: "About three minutes from a blank page to a shareable link." },
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <header className="mx-auto max-w-3xl px-6 pb-2 pt-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-5 text-lg text-rose-700/90">
          Everything you need to know about asking someone out with Whobela.
        </p>
      </header>
      <div className="mx-auto max-w-2xl px-6 py-10">
        <dl className="space-y-7">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-rose-950">{item.q}</dt>
              <dd className="mt-1.5 leading-relaxed text-rose-800/90">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
    </MarketingShell>
  );
}
