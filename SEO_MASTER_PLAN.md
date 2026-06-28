# Whobela — Complete SEO Master Plan

*The single source of truth. Supersedes `SEO_STRATEGY.md` (v1) and `SEO_STRATEGY_ADDENDUM.md` (v2). Grounded in the actual codebase: Next.js 16 App Router, Prisma/Postgres, one invitation page per user at `/r/[username]`.*

---

## Table of Contents

1. [Positioning & Strategy](#1-positioning--strategy)
2. [Indexing & Privacy Architecture](#2-indexing--privacy-architecture-do-this-first) ← **start here**
3. [Site Architecture & Sitemap](#3-site-architecture--sitemap)
4. [Keyword Map (cannibalization-safe)](#4-keyword-map)
5. [Page Inventory: Metadata & Structures](#5-page-inventory)
6. [Programmatic SEO System](#6-programmatic-seo-system)
7. [Free Tools (link & AEO magnets)](#7-free-tools)
8. [Blog Content Strategy](#8-blog-content-strategy)
9. [Internal Linking Plan](#9-internal-linking-plan)
10. [Technical SEO (Next.js 16)](#10-technical-seo-nextjs-16)
11. [Schema.org / Structured Data](#11-schemaorg-structured-data)
12. [AEO / GEO (AI answer engines)](#12-aeo--geo)
13. [Off-Page: Links, PR, Channels, Viral Loop](#13-off-page-links-pr-channels-viral-loop)
14. [Internationalization](#14-internationalization)
15. [Seasonal Calendar](#15-seasonal-calendar)
16. [E-E-A-T](#16-e-e-a-t)
17. [Measurement & Analytics](#17-measurement--analytics)
18. [Risk Register](#18-risk-register)
19. [Roadmap & Success Metrics](#19-roadmap--success-metrics)
20. [Content Writing Rules](#20-content-writing-rules)

---

## 1. Positioning & Strategy

**Product:** Whobela lets a user build one personalized, interactive "ask someone out" page, share a private link, and let the recipient respond, pick preferences, and schedule the date.

**The entity wedge (repeat everywhere):**
> *Whobela is a tool for creating personalized date-invitation pages — not a dating app. It's for asking someone you already know, in a way they'll never forget.*

This distinction is the whole SEO/AEO identity. Dating apps = meet strangers. Whobela = ask someone real, beautifully.

**Four search audiences:**
| Segment | Mindset | Primary intent | Lands on |
|---|---|---|---|
| Planners | "Make it special" | romantic/date invitation maker | Product pages |
| Questioners | "How do I do this?" | how to ask someone out | Blog + tools |
| Inspiration-seekers | "Give me ideas" | cute/funny ways, date ideas | Templates, blog, tools |
| Occasion-driven | "Valentine's/anniversary/proposal" | occasion + date | Occasion pages |

**The growth thesis:** organic traffic from these four segments + a **branded-search flywheel** (every shared invitation creates a new person who Googles "whobela"). The flywheel is likely the #1 channel in months 1–6; keyword SEO compounds behind it.

**Goal:** 80% self-sustaining organic acquisition within 12 months.

---

## 2. Indexing & Privacy Architecture (DO THIS FIRST)

**This is the most important section. The current app has no `noindex` on private pages and no `robots.ts`/`sitemap.ts`.**

The public invitation at `/r/[username]` is a **private message to one named recipient** ("Sarah has something to ask you 💌"). Indexing these = (a) a privacy incident and (b) thousands of thin, near-duplicate pages that trigger Google's *scaled/thin content* demotion across the whole domain.

### The indexing rule table

| Surface | Directive | Reason |
|---|---|---|
| `/r/[username]` (live invitation) | `noindex, follow` | Private, personal, thin-at-scale |
| `/preview/[username]` | `noindex, nofollow` | Internal preview |
| Custom-domain invitation sites | `noindex` | Same as `/r/*` |
| `/dashboard/**`, `/api/**`, auth, `/delete-account`, `/privacy-settings` | `noindex` | Non-public |
| Marketing, blog, templates, tools, occasion, programmatic (validated) | `index, follow` | The real SEO assets |
| Programmatic pages (unvalidated, fresh) | `noindex, follow` until they earn impressions | Quality gate (§6) |

**Critical nuance:** `noindex` does **not** disable Open Graph. The rich link preview when an invitation is pasted into iMessage/WhatsApp still works (unfurl bots ignore `robots`). Keep `r/[username]/opengraph-image.tsx`.

### Implementation

```ts
// src/app/r/[username]/page.tsx — add to the generateMetadata return
return {
  title,
  description: "Open this link to see your invitation ❤️",
  robots: { index: false, follow: true },   // ← the fix
  openGraph: { /* keep the existing rich preview */ },
};
```

```ts
// src/app/preview/[username]/page.tsx
export const metadata = { robots: { index: false, follow: false } };
```

Belt-and-suspenders in `robots.ts` (§10) with `Disallow: /r/`, `/preview/`, `/dashboard/`, `/api/`.

---

## 3. Site Architecture & Sitemap

```
whobela.com/
│
├── /                                  [Homepage — money]
│
├── PRODUCT / FEATURE PAGES (transactional)
│   ├── /create-date-invitation        [primary money page]
│   ├── /ask-someone-out-online
│   ├── /romantic-invitation-maker
│   └── /cute-ways-to-ask-someone-out
│       (digital/interactive variants → canonicalized into the above, see §4)
│
├── /templates                         [hub]
│   ├── /templates/first-date
│   ├── /templates/romantic-dinner
│   ├── /templates/coffee-date
│   ├── /templates/anniversary
│   ├── /templates/marriage-proposal
│   ├── /templates/long-distance
│   ├── /templates/surprise-date
│   ├── /templates/funny-ask-out
│   ├── /templates/beach-date
│   └── /templates/casual-hangout
│
├── /for                               (audience)
│   ├── /for/crush
│   ├── /for/boyfriend
│   ├── /for/girlfriend
│   └── /for/couples
│
├── /occasions                         (seasonal)
│   ├── /occasions/valentines-day
│   ├── /occasions/anniversary
│   ├── /occasions/first-date
│   ├── /occasions/birthday
│   └── /occasions/proposal
│
├── /tools                             (link/AEO magnets)
│   ├── /tools/date-idea-generator
│   ├── /tools/how-to-ask-someone-out-quiz
│   ├── /tools/first-date-questions
│   └── /tools/cute-ways-to-ask-generator
│
├── /date-ideas/{activity}             (programmatic — quality-gated)
├── /questions/{phrase}                (programmatic — quality-gated)
│
├── /vs                                (comparison)
│   ├── /vs/text-message
│   ├── /vs/dating-apps
│   └── /vs/traditional-invitation
│
├── /blog                              [hub]
│   ├── /blog/asking-someone-out/*
│   ├── /blog/date-ideas/*
│   ├── /blog/relationships/*
│   └── /blog/digital-dating/*
│
├── /about  /help  /contact  /faq  /pricing
├── /legal/*                           (exists)
│
└── NOINDEX: /r/[username], /preview/[username], /dashboard/*, /api/*
```

---

## 4. Keyword Map

**Warning:** all volumes below are **placeholders for prioritization, not data.** Validate with Keyword Planner + Search Console + Ahrefs/Semrush + AlsoAsked before committing the calendar.

**Rule: one canonical page per intent cluster.** Transactional → product page. Informational → blog/tool. Never two pages competing for the same query.

| Intent cluster | Canonical page | Primary keyword | Secondary keywords | Type |
|---|---|---|---|---|
| Make an invitation | `/create-date-invitation` | create a date invitation | digital/romantic/online date invitation, invitation maker | Transactional |
| Ask out online | `/ask-someone-out-online` | ask someone out online | how to ask someone out over text | Transactional/info |
| Romantic maker | `/romantic-invitation-maker` | romantic invitation maker | love invitation maker | Transactional |
| Cute/creative ways | `/cute-ways-to-ask-someone-out` | cute ways to ask someone out | creative ways to ask out | Info → product |
| How to ask out | `/blog/asking-someone-out/how-to-ask-someone-out` | how to ask someone out | without being awkward | Informational |
| Ask your crush | `/for/crush` | how to ask your crush out | cute way to ask crush out | Info → product |
| Date ideas (couples) | `/for/couples` | romantic date ideas for couples | date ideas | Info → product |
| First date | `/occasions/first-date` | best first date ideas | first date invitation | Info → product |
| Valentine's | `/occasions/valentines-day` | valentines date invitation | valentines day date ideas | Seasonal |
| Proposal | `/occasions/proposal` | creative marriage proposal ideas | proposal invitation | Info → product |

**Consolidation actions from v1:** merge `/digital-date-invitation` and `/interactive-love-invitation` into `/create-date-invitation` (canonical) — they target the same transactional intent and would cannibalize. Keep their phrasing as H2 sections / FAQ entries on the canonical page.

Maintain a living **keyword-map spreadsheet** (page ↔ primary ↔ secondary ↔ intent ↔ current rank). Check it before creating any new page.

---

## 5. Page Inventory

### 5.1 Homepage `/`

- **Title (≤60):** `Ask Someone Out Online | Whobela Date Invitation Maker`
- **Meta (≤155):** `Create a personalized, interactive date invitation. Share a private link, let them respond, and schedule the date. The beautiful way to ask someone out.`
- **H1:** `The Beautiful Way to Ask Someone Out`
- **Sub-hero:** `Forget the awkward text. Build a personal invitation page in 3 minutes, share one private link, and get your answer.`
- **Sections:** Hero + demo → Problem (asking is hard) → How it works (3 steps) → What you can build (personalize, respond, schedule, preferences) → "Not a dating app" entity block → Social proof → Templates strip → FAQ (FAQ schema) → final CTA.
- **FAQ:** What is Whobela? · Is it free? · How long does it take? · Is it private? · Will they know it's from me? · Is this a dating app? (answer: no).
- **Answer-first opener** (for AEO): a 45-word definition paragraph directly under H1.
- **Schema:** Organization + WebSite (Sitelinks search) + FAQPage.
- **Links out to:** the 4 money pages, `/templates`, `/for/crush`, top 2 blog posts, `/vs/dating-apps`.

### 5.2 `/create-date-invitation` (primary money page)
- **Title:** `Create a Date Invitation Online — Free & Personalized | Whobela`
- **Meta:** `Create a personalized date invitation in minutes. Add photos, music, and custom questions, share a private link, and get an instant answer.`
- **H1:** `Create a Personalized Date Invitation`
- **Structure:** answer-first intro → why an invitation beats a text → how it works (steps with screenshots) → what you can customize → live example → 8-question FAQ → CTA. Absorb "digital date invitation" + "interactive love invitation" as H2s.
- **Schema:** SoftwareApplication/Product + HowTo + FAQPage + Breadcrumb.

### 5.3 `/ask-someone-out-online`
- **Title:** `How to Ask Someone Out Online (That Actually Works) | Whobela`
- **Meta:** `Creative, confident ways to ask someone out online — from the perfect message to a personalized invitation. Tips, scripts, and examples.`
- **H1:** `How to Ask Someone Out Online`
- **Structure:** answer-first → why online works → 5 methods (invitation = hero) → best platforms → what not to do → timing → handling yes/maybe/no → FAQ → CTA.

### 5.4 `/romantic-invitation-maker`
- **Title:** `Romantic Invitation Maker — Date & Love Invites | Whobela`
- **Meta:** `Design beautiful romantic invitations for dates, anniversaries, and proposals. Personalized, customizable, instantly shareable.`
- **H1:** `Create Romantic Invitations That Express Your Heart`
- **Structure:** what makes an invite romantic → built-in romantic elements → types → template gallery → customization → mobile preview → privacy → FAQ → CTA.

### 5.5 `/cute-ways-to-ask-someone-out`
- **Title:** `Cute Ways to Ask Someone Out | 8 Ideas + Examples`
- **Meta:** `Cute, creative ways to ask someone out — from funny to romantic. Real examples, exact words to say, and templates to make them say yes.`
- **H1:** `Cute Ways to Ask Someone Out (That Make Their Heart Skip)`
- **Structure:** answer-first → cute vs cringey → 8 ways (invitation = #1) → by situation (crush/friend/online) → what to say (scripts) → after yes/no → FAQ → CTA.

### 5.6 Template pages `/templates/[slug]`
Shared structure: H1 `[Name] Date Invitation Template` → live preview + "Use this template" CTA → why/when to use it → customization (colors, font, music, photos) → example copy → 3-question FAQ → related templates. Each has unique example invitation content (use `Profile`/`DatePage` config data to make examples genuinely different).
- first-date · romantic-dinner · coffee-date · anniversary · marriage-proposal · long-distance · surprise-date · funny-ask-out · beach-date · casual-hangout

### 5.7 Audience pages `/for/[slug]`
- **/for/crush** — `How to Ask Your Crush Out (Without the Awkwardness)` — the highest-intent informational→product page; full guide + scripts by situation.
- **/for/boyfriend** — `Romantic Date Ideas & Invitations for Your Boyfriend`
- **/for/girlfriend** — `Cute Date Invitation Ideas for Your Girlfriend`
- **/for/couples** — `Date Ideas for Couples — Keep the Spark Alive`

### 5.8 Occasion pages `/occasions/[slug]`
valentines-day · anniversary · first-date · birthday · proposal. Each: emotional intro → why it matters → date ideas by budget → how to invite them (CTA to builder) → mistakes to avoid → FAQ.

### 5.9 Comparison pages `/vs/[slug]`
- **/vs/dating-apps** — the entity-defining page: "Whobela isn't a dating app." For-people-you-know vs meet-strangers; when to use each; better-together.
- **/vs/text-message** — text vs beautiful invitation; response-rate framing.
- **/vs/traditional-invitation** — digital, interactive, trackable.

### 5.10 Support marketing
`/about` (Organization/E-E-A-T), `/help`, `/contact`, `/faq` (master FAQPage), `/pricing` (Product/Offer schema). These also **own branded SERPs** (§13).

---

## 6. Programmatic SEO System

Two generators, both **quality-gated** to avoid Google's scaled-content penalty.

### 6.1 `/date-ideas/{activity}`
DB-driven from a `date_ideas` table: `name, slug, keywords, intro, cost_level, duration, location_type, vibe, best_for, example_invite`. Auto-generates title, meta, H1, 4–5 sections (why it works, how to invite, ideas list, conversation starters, tips), FAQ, CTA.
- coffee-date, dinner-date, movie-night, picnic, hiking, beach-day, wine-tasting, concert, museum, cooking-class, weekend-getaway, at-home-dinner, karaoke, game-night, road-trip, stargazing, …

### 6.2 `/questions/{phrase}`
Captures exact-phrase searches people want to *say*: will-you-go-on-a-date-with-me, want-to-grab-coffee, dinner-this-saturday, are-you-free-saturday, can-i-take-you-out, will-you-be-my-valentine. Each: how to ask this, when, exact wording, their possible responses, what not to do, CTA.

### 6.3 The quality gate (mandatory — all four)
1. **≥40% unique, non-templated content** per page (real copy, not swapped nouns).
2. **A unique asset** — an embedded example invitation generated from real config data, original tips, or a mini-tool.
3. **Validated search demand** (not a guessed permutation).
4. **≥1 editorial internal link** pointing in for a real reason.

**Ship `noindex, follow` → promote winners.** Launch each batch noindexed; after 4–6 weeks promote to `index` only the URLs earning impressions in Search Console. Keep the indexable footprint clean.

---

## 7. Free Tools

Top-of-funnel magnets that rank, earn links, get cited by AI, and funnel into the builder. Each ends with "now turn this into a real invitation."

- **/tools/date-idea-generator** — prompts → tailored date idea (shares the `date_ideas` data).
- **/tools/how-to-ask-someone-out-quiz** — situation → approach + script.
- **/tools/first-date-questions** — conversation-starter generator.
- **/tools/cute-ways-to-ask-generator** — playful one-liners by relationship type.

Build as embeddable widgets (with attribution link) for natural backlinks.

---

## 8. Blog Content Strategy

Hub at `/blog`, four clusters. Each article: 1,500–2,500 words, answer-first opener, H2 structure, 2–3 FAQ entries (FAQPage schema), 3–5 internal links **up to the relevant money page**, named author (§16), CTA, related-posts block.

**Asking Someone Out** — how-to-ask-someone-out *(cluster pillar)* · ways-to-ask-your-crush-out · cute-messages-to-ask-on-a-date · confidence-tips-for-asking-out · what-to-do-if-they-say-no · should-i-ask-them-out-signs.

**Date Ideas** — best-first-date-ideas · romantic-date-ideas-for-couples · cheap-date-ideas · anniversary-date-ideas-by-year · date-ideas-for-introverts · how-to-plan-a-date-night.

**Relationships** — how-to-create-memorable-moments · creative-romantic-gestures · how-to-make-someone-feel-loved · conversation-starters-for-couples.

**Digital Dating** — creative-ways-to-ask-someone-out-online · long-distance-date-ideas · why-personalized-invitations-beat-apps · digital-romance-trends.

Each blog post supports a money page (§4) and never competes with it for the transactional keyword.

---

## 9. Internal Linking Plan

**Tiers (link equity flows down, supporting pages link up):**
- **Tier 1 (15+ inbound):** Homepage, `/create-date-invitation`, `/ask-someone-out-online`, `/romantic-invitation-maker`.
- **Tier 2 (8–12):** `/for/*`, top templates, `/occasions/valentines-day`, blog cluster pillars, tools.
- **Tier 3 (4–8):** individual templates, blog articles, occasion pages, comparison pages.
- **Tier 4 (1–3):** programmatic pages.

**Flow map:**
```
Homepage ─┬─► money pages ─► templates ─► builder CTA
          ├─► /for/crush, /for/couples
          ├─► /vs/dating-apps   (entity)
          └─► top blog posts

Blog (informational) ──► money page (same cluster) + 1–2 templates + builder CTA
Tools ──► money page + relevant blog
Programmatic ──► parent hub + 1 money page
Recipient /r/* (noindex) ──► "make your own" ► /create-date-invitation   (the loop, §13)
```

**Anchor text:** keyword-rich, natural ("romantic invitation maker", "ask your crush out") — never "click here".

---

## 10. Technical SEO (Next.js 16)

Use App Router native primitives.

- **`src/app/sitemap.ts`** (`MetadataRoute.Sitemap`) — emit all indexable marketing/blog/template/tool/occasion/validated-programmatic URLs dynamically. **Exclude `/r/*`, `/preview/*`, `/dashboard/*`, `/api/*`.** Split into a sitemap index if >50k URLs.
- **`src/app/robots.ts`** (`MetadataRoute.Robots`) — `Allow: /`; `Disallow: /dashboard/, /api/, /preview/, /r/`; reference the sitemap.
- **`generateMetadata`** per route — title, description, `alternates.canonical` (self-referencing), OG, Twitter. Defaults centralized in `layout.tsx` (already partly present), overridden per page.
- **Dynamic OG images** via `ImageResponse` in `opengraph-image.tsx` — already done for `/r/*`; replicate for templates/blog/occasions so shares look intentional.
- **ISR for programmatic + blog** — `export const revalidate = 86400` + `generateStaticParams`, so hundreds of pages are statically served and cheap.
- **Canonical discipline** — self-canonical on every indexable page; canonicalize the consolidated duplicates from §4.
- **Core Web Vitals targets** — LCP <2.5s, INP <200ms, CLS <0.1. Use `next/image` (WebP, lazy), `next/font`, code-split heavy client components (e.g. `react-easy-crop`, `framer-motion`) off marketing routes.
- **Mobile-first** — already responsive; verify touch targets ≥48px and no blocking interstitials.

---

## 11. Schema.org / Structured Data

Implement as a reusable `<JsonLd>` component (`<script type="application/ld+json">`).

| Schema | Where |
|---|---|
| `Organization` + `WebSite` (Sitelinks SearchAction) | Homepage / layout |
| `SoftwareApplication` / `Product` + `Offer` | Product & pricing pages |
| `FAQPage` | Every page with a FAQ block |
| `HowTo` | How-to guides & builder steps |
| `Article` + `Person` (author) | Blog posts |
| `BreadcrumbList` | All nested pages |

Keep markup in sync with on-page content (no schema-only claims). Aggregate `AggregateRating` only with real reviews.

---

## 12. AEO / GEO

A large share of "how do I ask someone out" research now happens in ChatGPT, Perplexity, Gemini, and Google AI Overviews (often zero-click). Optimize to be the cited source.

- **Answer-first**: every informational page opens with a 40–60 word direct answer, then expands.
- **Extractable formats**: definition boxes, numbered steps, comparison tables, tight Q&A — what engines lift.
- **Entity clarity**: repeat the "not a dating app" definition; make `/vs/dating-apps` the canonical disambiguation.
- **`llms.txt`** at root summarizing Whobela + key links.
- **Be in the cited sources**: Reddit, Quora, YouTube, listicles (§13) — what AI Overviews quote for this niche.
- **Track** referrals from `chatgpt.com`, `perplexity.ai`, etc.; monitor AI-Overview presence for target queries.

---

## 13. Off-Page: Links, PR, Channels, Viral Loop

### 13.1 The viral loop → branded search (the #1 early channel)
Create → share private link → recipient opens → recipient Googles "whobela" → some become creators. Design for it:
- **Own branded SERPs:** home, `/about`, `/help`, plus "is whobela legit/safe/free" trust content; Organization schema + clean nav for sitelinks.
- **Recipient → creator:** a tasteful "make your own" entry on `/r/*` (noindex page, real human reader) → `/create-date-invitation`.
- **Measure** invitation-open → make-your-own → signup as a first-class funnel (§17).

### 13.2 Backlinks & digital PR
- **Annual data study** from aggregate, privacy-safe platform data: *"We analyzed 50,000 date invitations — the yes-rate, the most popular date, the best day to ask."* High-authority press links, repeatable yearly.
- **Seasonal press hooks** (Valentine's, cuffing season, proposal season) pitched 6–8 weeks ahead.
- **HARO/journalist sourcing** with a named relationship expert (ties to §16).
- **Partnerships** with florists, restaurants, date-box brands (co-marketing + links).
- **Embeddable tools** (§7) as link earners.

### 13.3 Channel SEO (where the intent actually lives)
- **Pinterest** — a search engine for "ways to ask out" / "date night ideas"; likely fastest early traffic. Pin templates/ideas linking back.
- **YouTube** — how-to + "I asked my crush out with this"; wins Google video carousels.
- **Reddit/Quora** — authentic help in r/dating, r/relationships; feeds referrals + AI citations.
- **TikTok** — product demos drive branded search (feeds 13.1).

---

## 14. Internationalization

Do **not** duplicate English country pages (`/dating-invitation/united-states` etc. from v1) — same-language near-duplicates cannibalize. Two valid paths:
- **Localize** country pages only if each has genuinely local content (norms, idiom, examples). Otherwise collapse to one English page.
- **Translate** for real international growth: `/es/`, `/de/`, `/fr/`, `/pt-br/` with proper `hreflang` (Next.js `alternates.languages`). Romance content travels; non-English SERPs are far less competitive.

**Decision:** defer all i18n until the English core ranks; then prefer language expansion over country duplication.

---

## 15. Seasonal Calendar

SEO lags, so publish ahead of demand. Refresh the *same* URL yearly (don't spin up `/valentines-2026`).

| Publish by | Campaign | Pages |
|---|---|---|
| Early November | **Valentine's (the Super Bowl)** | /occasions/valentines-day, /templates/romantic-dinner, related blog |
| October | Cuffing season / "putting myself out there" | /ask-someone-out-online, /for/crush |
| February–March | Proposal & wedding season | /occasions/proposal, /templates/marriage-proposal |
| April–May | Summer dating, first dates | /occasions/first-date, /templates/beach-date |
| Year-round | Anniversaries, birthdays | /occasions/anniversary, /occasions/birthday |

---

## 16. E-E-A-T

Relationship advice gets extra quality scrutiny.
- **Real author entities** — named writer, bio, photo, `/author/*` page, `Person` schema with `sameAs`.
- **Experience signals** — first-hand examples, consented user stories, original product screenshots (hardest for competitors to fake).
- **Trust surfaces** — surface existing `/legal/safety`, `/legal/privacy`, `/report-abuse`; reinforce "private invitation, not a dating app." Trust feeds branded-search capture (§13.1).

---

## 17. Measurement & Analytics

**Instrument before launch.** Core funnel:
```
organic landing → builder_started → invitation_published → link_shared
→ recipient_opened → make_your_own_clicked → signup_completed → subscription_started
```
- **Events** tagged with first-touch source (organic / branded / social / AI).
- **Search Console** = query-level source of truth; pipe to BigQuery for retention.
- **Segment branded vs non-branded organic** — early branded (from the loop) will dominate; don't mistake it for keyword SEO working yet.
- **Page-level decay monitoring** — flag pages losing impressions → refresh queue.

---

## 18. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Private `/r/*` pages indexed | High (default today) | Severe (privacy + ranking) | §2 `noindex` now |
| Thin programmatic pages → site-wide demotion | High if naive | Severe | §6 quality gate + noindex-first |
| Keyword cannibalization | High (per v1 structure) | Medium | §4 keyword map, consolidate |
| Planning on fabricated volumes | Certain (v1 numbers) | Medium | §4 real research first |
| AI-Overview zero-click erodes clicks | Ongoing | Medium | §12 AEO, own branded + tools |
| YMYL quality scrutiny | Medium | Medium | §16 E-E-A-T |
| Country-page duplication | Medium | Low/Med | §14 language not country |

---

## 19. Roadmap & Success Metrics

### Days 1–30 — Foundation & the loop
1. **`noindex` on `/r/*` and `/preview/*`** (§2) — live privacy gap, do first.
2. `robots.ts` + `sitemap.ts` + metadata/canonical defaults (§10).
3. Branded-search capture: tighten home/about/help, Org+WebSite schema, "make your own" on recipient pages (§13.1).
4. Real keyword research → keyword map (§4); GA4 + Search Console + event taxonomy (§17).

### Days 31–60 — Core indexable assets
5. 4–5 consolidated money pages with FAQ schema + answer-first (§4, §5, §12).
6. First 2 free tools (§7).
7. Pinterest + one more channel live (§13.3).

### Days 61–90 — Scale with guardrails
8. Blog cluster pillars + first supporting posts (§8).
9. First programmatic batch shipped **noindex**, promote winners after 4–6 weeks (§6).
10. Valentine's content live by early November (§15).
11. First data-study pitch (§13.2).

### Targets (validate/adjust after real keyword data)
| Quarter | Organic users/mo | Top-10 keywords |
|---|---|---|
| Q1 | 500–1,000 (mostly branded) | core pages indexing |
| Q2 | 2,000–3,000 | 5+ |
| Q3 | 5,000–8,000 | 15+ |
| Q4 | 10,000–15,000 | 15+ incl. a few #1 |

**Conversion targets:** organic → signup 3–5%; template/tool page → builder click 25–35%; recipient-open → make-your-own 5–10%.

---

## 20. Content Writing Rules

Every page must:
- **Feel romantic** — emotional resonance, not clinical feature lists.
- **Sound human** — contractions, warmth, specificity; no generic AI filler.
- **Match intent** — answer what they're actually asking, answer-first.
- **Be specific** — "ask them for coffee Saturday," not "ask them out."
- **Tell a story** — why this moment matters emotionally.
- **Avoid spam** — no keyword stuffing; one intent per page.
- **Convert** — every page ends pointing toward building an invitation.

**Voice check:**
> ❌ *"Creating a personalized invitation is an effective method to express romantic interest through a unique digital experience."*
> ✅ *"There's something about a personalized invitation that says: I've been thinking about you. I cared enough to make this special."*

The visitor should leave thinking: **"This is the perfect way to ask them out."**

---

*End of master plan. The two predecessor docs (`SEO_STRATEGY.md`, `SEO_STRATEGY_ADDENDUM.md`) can be archived — everything actionable is consolidated here.*
```
