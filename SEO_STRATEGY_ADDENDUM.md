# Whobela SEO Strategy — Addendum (v2)

*Additions and corrections after auditing the actual codebase. Read alongside `SEO_STRATEGY.md`.*

> **Context that changes the plan:** Whobela is built on Next.js 16 (App Router). The only public-facing page that exists today is the **per-user invitation at `/r/[username]`** (plus `/preview/[username]`, custom domains, and a marketing homepage). Every SEO surface in the v1 doc — `/templates`, `/for`, `/occasions`, `/date-ideas`, `/blog` — **does not exist yet**. There is no `sitemap.ts` and no `robots.ts`. This addendum is ordered by impact.

---

## A. 🚨 CRITICAL CORRECTION — Private invitation pages must be `noindex`

The v1 doc treats user-generated invitation pages as an SEO asset and even proposes Open Graph tags reading *"Someone created something special for you ❤️"* as a discovery surface. **This is backwards for `/r/[username]`.**

These pages are:
- **Private** — addressed to one named recipient ("Sarah has something to ask you 💌"). Indexing them leaks personal romantic content into Google. That is a privacy incident and a trust-killer for the product.
- **Thin & near-duplicate at scale** — thousands of structurally identical pages with little unique text is exactly what Google's *scaled content* / *thin content* systems demote. It can drag down the whole domain.

**Required rule:**

| Surface | Indexable? | Why |
|---|---|---|
| `/r/[username]` (live invitation) | **`noindex, follow`** | Private, personal, thin-at-scale |
| `/preview/[username]` | **`noindex, nofollow`** | Internal preview |
| `/dashboard/**`, `/api/**`, auth pages | **`noindex`** | Already non-public |
| Custom-domain invitation sites | **`noindex`** | Same as `/r/*` |
| Marketing/blog/template/programmatic pages | **`index, follow`** | The actual SEO assets |

**Key nuance:** `noindex` does **not** disable Open Graph. You still want the rich link preview when someone pastes their invitation into iMessage/WhatsApp (the existing `r/[username]/opengraph-image.tsx` is correct and should stay). Social unfurl bots read OG tags regardless of `robots`. So: **keep the OG image, add `robots: { index: false }`** to the page's `generateMetadata`.

```ts
// src/app/r/[username]/page.tsx — inside generateMetadata return
return {
  title,
  description: "Open this link to see your invitation ❤️",
  robots: { index: false, follow: true }, // ← add this
  openGraph: { /* keep existing rich preview */ },
};
```

**The SEO/growth engine is NOT the invitation pages — it's the marketing pages + the branded-search flywheel they create (see §G).**

---

## B. Programmatic SEO needs a quality gate (or it becomes a liability)

The v1 doc proposes 100+ programmatic pages (`/date-ideas/*`, `/questions/*`, `/dating-invitation/{country}`). Generated from a template with thin variation, these now trigger Google's **"scaled content abuse"** policy (March 2024 Helpful Content update + ongoing). Volume without uniqueness is a net negative.

**Quality gate — every programmatic page must clear all four before it's allowed to `index`:**
1. **≥40% unique, non-templated content** — real, specific copy per entity (not just swapped nouns).
2. **A unique asset** — an embedded example invitation, a real screenshot, original tips, or a mini-tool. Something a competitor's listicle doesn't have.
3. **Genuine search demand** — validated volume (see §C), not a guessed permutation.
4. **Internal demand** — at least one editorial page links to it for a real reason.

**Ship them `noindex` first, promote winners.** Launch programmatic batches as `noindex, follow`. After 4–6 weeks, promote to `index` only the pages getting impressions in Search Console. This keeps the indexable footprint high-quality and avoids a site-wide trust hit.

**Concrete unique-content sources you already have:** the `Profile` model (hobbies, interests, favorite activities) and `DatePage` themes/configs mean you can generate *genuinely* differentiated example invitations per date-idea/occasion — use that as the "unique asset" on each programmatic page.

---

## C. Keyword map & cannibalization control (the v1 doc has both problems)

**Problem 1 — fabricated volumes.** The search volumes in v1 (e.g. "ask someone out online (550)") are illustrative placeholders, not data. Do not plan around them. Run real research first: **Google Keyword Planner + Search Console (once live) + one of Ahrefs/Semrush + AlsoAsked/AnswerThePublic** for the question long-tail. Re-baseline before committing the content calendar.

**Problem 2 — cannibalization.** Several v1 pages target the same intent and will compete with each other in the SERP, splitting authority:
- `/ask-someone-out-online` vs `/cute-way-to-ask-someone-out` vs `/for/crush` vs blog `how-to-ask-someone-out` — all chase "how to ask someone out."
- `/romantic-invitation-maker` vs `/create-date-invitation` vs `/digital-date-invitation` — all "make an invitation."

**Fix — one canonical page per intent cluster, with a documented keyword map:**

| Intent cluster | Canonical (money) page | Supporting (blog) pages link UP to canonical |
|---|---|---|
| Make an invitation (transactional) | `/` or `/create-date-invitation` — pick **one** | digital/romantic/interactive variants → consolidate or canonicalize |
| How to ask someone out (informational) | `/blog/.../how-to-ask-someone-out` | crush/awkward/confidence articles link to it + to the maker |
| Cute/creative ways (informational) | `/cute-ways-to-ask-someone-out` | funny/romantic template pages |

Rule of thumb: **transactional intent → product page; informational intent → blog; never two pages for the same query.** Maintain the keyword map as a living spreadsheet (page ↔ primary keyword ↔ secondary ↔ intent) and check it before creating any new page.

---

## D. AEO / GEO — optimize for AI answer engines (entirely missing from v1)

A large and growing share of "how do I ask someone out" research now happens in **ChatGPT, Perplexity, Gemini, and Google AI Overviews** — often with zero clicks. v1 has nothing for this. For a young, romance-curious audience this is a primary discovery channel, not an afterthought.

**What to add:**
- **Answer-first structure** — open every informational page with a 40–60 word direct answer to the query, *then* expand. AI engines lift these.
- **Extractable formats** — definition boxes, numbered steps, comparison tables, and tight Q&A. These are what gets cited.
- **Entity clarity** — a crisp, repeated definition: *"Whobela is a tool for creating personalized date-invitation pages — not a dating app."* (See the `/vs/dating-apps` page; that distinction is your entity wedge.)
- **`llms.txt`** at the domain root summarizing what Whobela is and linking key pages, so AI crawlers parse the site cleanly.
- **Get cited in the sources AI quotes** — Reddit, Quora, YouTube, and listicles are what AI Overviews pull from for this niche (see §I). Presence there feeds AEO.
- **Track it** — monitor referral traffic from `chatgpt.com`, `perplexity.ai`, etc., in analytics; watch AI Overview presence for target queries.

---

## E. Free tools as linkable assets (top-of-funnel magnets)

The single best link-earning and AEO play for this product is **free micro-tools** that solve a slice of the problem instantly, then funnel into "now make it a real invitation." These rank, earn backlinks naturally, and get embedded/shared:

- **`/tools/date-idea-generator`** — answer a few prompts → date idea. (Powered by the same `date-ideas` data.)
- **`/tools/how-to-ask-someone-out-quiz`** — situation → tailored approach + script.
- **`/tools/first-date-questions`** — generates conversation starters.
- **`/tools/cute-ways-to-ask-generator`** — playful one-liners by relationship type.
- **`/tools/rejection-recovery`** or **`/tools/are-they-into-you`** — engagement bait, highly shareable.

Each tool page: ranks for "[tool] + generator/ideas," is a natural link target, and ends with a CTA into the invitation builder. Tools earn links that listicles never will.

---

## F. Backlinks & digital PR (v1 has ~one paragraph; it needs a real plan)

Content without links won't rank for competitive terms ("romantic date ideas" etc.). Add an earned-links program:

- **Linkable data study (annual):** anonymized, aggregate stats from your own platform — *"We analyzed 50,000 date invitations: the yes-rate, the most popular date type, the best day to ask."* This is catnip for lifestyle/relationship journalists and earns high-authority links every year. (Only aggregate, privacy-safe data.)
- **Seasonal press hooks:** Valentine's, "cuffing season," wedding/proposal season — pitch data + expert quotes to press 6–8 weeks ahead.
- **Digital PR / HARO-style sourcing:** offer a named relationship/dating "expert" voice for journalist queries (ties into E-E-A-T, §L).
- **Partnerships & embeds:** florists, restaurants, date-box subscriptions — co-marketing + backlinks.
- **The free tools (§E)** as embeddable widgets with attribution links.

---

## G. The viral loop IS the SEO flywheel — design for branded search

This is the highest-leverage idea missing from v1. Whobela's growth mechanic — *create → share private link → recipient opens it* — means **every sent invitation exposes a new person to the brand**, who then searches **"whobela"** or **"what is whobela"** or **"whobela legit"**. That branded demand is huge, cheap to capture, and compounds.

**Capture it deliberately:**
- **Own all branded SERPs:** homepage, `/about`, `/help`, plus reviews/trust content ("Is Whobela legit/safe/free?"). Add `Organization` + `SiteNavigationElement` schema and sitelinks-friendly nav.
- **The recipient is a future creator.** The `/r/[username]` page (noindex, but a real human is reading it) should have a tasteful "make your own" entry point — that's the loop closing into new branded searches and signups.
- **Measure the loop:** track invitation-open → "make your own" click → signup as a first-class funnel (see §M). This is your real organic acquisition number, larger than keyword traffic in the early months.

---

## H. Next.js 16 implementation specifics (v1 is stack-agnostic; here's the concrete path)

The app uses the App Router. Implement SEO with native primitives, not bolt-ons:

- **`src/app/sitemap.ts`** — `MetadataRoute.Sitemap`. Generate marketing/blog/template/programmatic URLs dynamically; **exclude `/r/*`, `/preview/*`, `/dashboard/*`, `/api/*`**. Split into a sitemap index if it exceeds 50k URLs.
- **`src/app/robots.ts`** — `MetadataRoute.Robots`. Allow marketing; `Disallow: /dashboard/, /api/, /preview/, /r/` (belt-and-suspenders alongside per-page `noindex`); point to the sitemap.
- **`generateMetadata` per route** — titles, descriptions, canonical (`alternates.canonical`), OG, Twitter. Centralize defaults in `layout.tsx` (already partly done) and override per page.
- **Dynamic OG images** via `ImageResponse` (`opengraph-image.tsx`) — already done for `/r/*`; replicate for templates/blog so shares look intentional.
- **ISR for programmatic pages** — `export const revalidate = 86400` + `generateStaticParams` so the hundreds of `/date-ideas/*` etc. are statically served and cheap.
- **JSON-LD** via a `<script type="application/ld+json">` component: `Organization` (home), `FAQPage` (FAQ blocks), `Article` (blog), `BreadcrumbList`, `SoftwareApplication`/`Product` (product pages), `HowTo` (guides).
- **Canonical discipline** — self-referencing canonical on every indexable page; canonicalize the consolidated intent-duplicates from §C.

---

## I. Channel SEO — go where this intent actually lives

For "cute ways to ask someone out," "date ideas," and "how to ask your crush out," the SERP and the audience's actual research happen heavily on **Pinterest, Reddit, YouTube, TikTok, and Quora** — not just Google web results. Ranking *only* on Google leaves most of the demand uncaptured (and these are the sources AI Overviews cite — see §D).

- **Pinterest** is a search engine for exactly this niche (visual "ways to ask out" / "date night ideas"). Publish template/idea pins linking back. Likely your fastest early traffic source.
- **YouTube** — short how-to / "I asked my crush out with this" content; video also wins Google video carousels.
- **Reddit/Quora** — genuine, helpful presence in r/dating, r/relationships threads; feeds both referral traffic and AI citations. (Authentic help, not spam.)
- **TikTok** — demo the product; drives branded search (feeds §G).

Treat these as part of the SEO system because they directly influence rankings (links, brand signals) and AEO citations.

---

## J. Internationalization — fix the language-vs-country confusion

v1's `/dating-invitation/{country}` pages are all in **English** and conflate *country targeting* with *language targeting*. That's not how international SEO works.

- **Same-language country pages** (US/UK/CA/AU/IE/NZ) thinly differentiated will cannibalize each other. Only build them if each has **genuinely localized** content (local norms, examples, idiom) — otherwise collapse to one English page.
- **Real international growth = translated content** (`/es/`, `/de/`, `/fr/`, `/pt-br/`) with proper **`hreflang`** annotations (via Next.js `alternates.languages`). Romance content travels well and non-English SERPs are far less competitive — likely higher ROI than English country-splits.
- **Decision needed:** pick *language expansion* (translate) over *country duplication* unless you can truly localize. Defer all of this until the English core ranks.

---

## K. Seasonal campaign calendar — Valentine's is your Super Bowl

v1 mentions Valentine's as one occasion page. For this product it's **the single biggest demand spike of the year**, and SEO is a lagging channel — you must rank *before* the spike.

- **Build & publish Valentine's/anniversary/proposal content by early November** so it's indexed and aged before Jan–Feb search surge.
- **Annual content calendar with lead times:** Valentine's (publish Nov), wedding/proposal season (publish Feb–Mar), summer dating, "cuffing season" (Oct), New Year "putting myself out there."
- **Refresh, don't recreate:** update the same Valentine's URL each year (keeps accumulated authority) rather than spinning up `/valentines-2026`.

---

## L. E-E-A-T / YMYL signals (relationships is sensitive-topic adjacent)

Relationship/dating advice gets extra scrutiny from Google's quality systems. v1's "Dating Coach" author placeholder isn't enough.

- **Real author entities** — named writer with a bio, photo, credentials, and a linked `/author/*` page; `Person` schema with `sameAs` to real profiles.
- **Experience signals** — first-hand examples, real user stories (with consent), original screenshots from the product. This is "Experience" in E-E-A-T, the hardest for competitors to fake.
- **Trust pages** — visible privacy/safety stance (you already have `/legal/safety`, `/legal/privacy`, `/report-abuse` — surface them), clear "we're not a dating app, your invitation is private" messaging. Trust directly supports the branded-search capture in §G.

---

## M. Measurement & event taxonomy (v1 has vanity targets, no instrumentation)

Define the funnel and the events before launch, or you can't tell SEO winners from losers.

**Core funnel to instrument:** organic landing → builder start → invitation published → invitation shared → **recipient open** → recipient "make your own" → signup → paid.

- **Events:** `builder_started`, `invitation_published`, `link_shared`, `recipient_opened`, `make_your_own_clicked`, `signup_completed`, `subscription_started` — each tagged with first-touch source (organic/branded/social/AI).
- **Search Console** as source of truth for query-level performance; pipe to BigQuery for retention.
- **Segment "branded vs non-branded" organic** — early on, branded (from the viral loop, §G) will dominate; don't mistake it for keyword SEO working yet.
- **Page-level decay monitoring** — flag pages losing impressions for refresh.

---

## N. Risk register (new — the things that can sink the whole domain)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Private `/r/*` pages indexed | High (default behavior) | Severe (privacy + ranking) | §A `noindex` now |
| Thin programmatic pages → site-wide demotion | High if shipped naively | Severe | §B quality gate + noindex-first |
| Keyword cannibalization | High (per v1 structure) | Medium | §C keyword map, consolidate |
| Planning on fabricated volumes | Certain (v1 as written) | Medium | §C real research first |
| AI-Overview zero-click erodes traffic | Ongoing | Medium | §D AEO, own branded + tools |
| YMYL quality scrutiny | Medium | Medium | §L E-E-A-T |
| Country-page duplication | Medium | Low/Med | §J language not country |

---

## O. Revised 90-day priority (nothing is built — sequence matters)

The v1 roadmap front-loads volume. Given the real starting point (zero SEO pages, zero infra), do foundation + flywheel first.

**Days 1–30 — Foundation & the loop (highest ROI):**
1. `noindex` on `/r/*` and `/preview/*` (§A) — **do this first, it's a live privacy gap.**
2. `robots.ts` + `sitemap.ts` + canonical/metadata defaults (§H).
3. Branded-search capture: tighten home/about/help, add Org schema, add "make your own" entry on recipient pages (§G).
4. Real keyword research → keyword map (§C). GA4 + Search Console + event taxonomy (§M).

**Days 31–60 — Core indexable assets:**
5. 4–5 consolidated money pages (one per intent cluster) with FAQ schema + answer-first structure (§C, §D).
6. First 2 free tools (§E) — fastest links + AEO.
7. Pinterest + one more channel live (§I).

**Days 61–90 — Scale with guardrails:**
8. Blog cluster (informational intent) linking up to money pages.
9. First programmatic batch shipped **`noindex`**, promote winners after 4–6 weeks (§B).
10. Valentine's content live by early Nov regardless of where this lands in the calendar (§K).
11. First data-study pitch for links (§F).

---

### TL;DR of what this addendum adds to v1
1. **Fix the privacy/indexing gap on `/r/*`** (most urgent, and v1 got it backwards).
2. **Quality-gate + noindex-first** the programmatic pages so they help instead of hurt.
3. **Keyword map to kill cannibalization;** don't trust v1's invented volumes.
4. **AEO/GEO** for AI answer engines.
5. **Free tools** as link/AEO magnets.
6. **Digital PR + an annual data study** for real backlinks.
7. **Design the viral loop into branded-search capture** — likely your #1 early channel.
8. **Concrete Next.js 16 implementation** (sitemap/robots/metadata/ISR/JSON-LD).
9. **Pinterest/Reddit/YouTube** as part of the SEO system.
10. **Language (hreflang) over duplicated country pages.**
11. **Seasonal calendar with lead times** (Valentine's by November).
12. **E-E-A-T author entities, measurement taxonomy, and a risk register.**
