import Link from "next/link";
import { DatePageView } from "@/components/date-page";
import { SiteFooter } from "@/components/site-footer";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
} from "@/lib/seo/jsonld";
import {
  DEFAULT_THEME,
  DEFAULT_INVITE_CONFIG,
  DEFAULT_YES_CONFIG,
  DEFAULT_NO_CONFIG,
  DEFAULT_REACTION_CONFIG,
  DEFAULT_SCHEDULING_CONFIG,
} from "@/lib/date-page-defaults";

export const metadata = buildMetadata({
  title: "Ask Someone Out Online | Whobela Date Invitation Maker",
  description:
    "Create a personalized, interactive date invitation. Share a private link, let them respond, and schedule the date. The beautiful way to ask someone out.",
  path: "/",
});

const POPULAR_LINKS = [
  { href: "/create-date-invitation", label: "Create a date invitation" },
  { href: "/ask-someone-out-online", label: "How to ask someone out online" },
  { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
  { href: "/templates", label: "Browse invitation templates" },
  { href: "/for/crush", label: "How to ask your crush out" },
  { href: "/vs/dating-apps", label: "Whobela vs. dating apps" },
];

export default function LandingPage() {
  return (
    <>
    <main className="flex-1 bg-gradient-to-b from-rose-50 via-white to-pink-50">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-16 text-center sm:py-24">
        <span className="mb-6 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          🌸 whobela
        </span>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-rose-950 sm:text-5xl">
          Create a magical way to ask someone out.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-rose-700/80">
          Create a cute interactive date invitation. Share your personal link. Let
          someone special choose when to meet.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-rose-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            Create your date page
          </Link>
          <a
            href="#demo"
            className="rounded-full border border-rose-200 bg-white px-8 py-3 text-base font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            See an example
          </a>
        </div>
      </div>

      <p className="px-6 text-center text-sm font-medium text-rose-500/80">
        Try it yourself — this is a real, live demo 👇
      </p>
      <div id="demo">
        <DatePageView
          datePageId="demo"
          mode="demo"
          photoUrls={[]}
          config={{
            theme: DEFAULT_THEME,
            inviteConfig: DEFAULT_INVITE_CONFIG,
            yesConfig: DEFAULT_YES_CONFIG,
            noConfig: DEFAULT_NO_CONFIG,
            reactionConfig: DEFAULT_REACTION_CONFIG,
            schedulingConfig: DEFAULT_SCHEDULING_CONFIG,
            preferenceConfig: { question: "", options: [], multiSelect: false },
            confirmationConfig: { message: "", subMessage: "" },
          }}
        />
      </div>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-rose-950">
          The beautiful way to ask someone out
        </h2>
        <p className="mt-3 text-center text-rose-700/80">
          Whobela is a tool for creating personalized date-invitation pages — not a dating
          app. It&apos;s for asking someone you already know, in a way they&apos;ll never forget.
        </p>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {POPULAR_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-rose-100 bg-white px-4 py-3 text-rose-700 transition hover:border-rose-200 hover:text-rose-600"
              >
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
    <SiteFooter />
    <JsonLd data={organizationSchema()} />
    <JsonLd data={websiteSchema()} />
    <JsonLd data={softwareApplicationSchema()} />
    </>
  );
}
