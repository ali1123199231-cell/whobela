import type { SeoPage } from "./types";

// §5.7 — audience pages at /for/[slug].

export const AUDIENCE_PAGES: Record<string, SeoPage> = {
  crush: {
    path: "/for/crush",
    slug: "crush",
    primaryKeyword: "how to ask your crush out",
    eyebrow: "For your crush",
    title: "How to Ask Your Crush Out (Without the Awkwardness) | Whobela",
    description:
      "How to ask your crush out with confidence — when to do it, exactly what to say, and a cute way to make them say yes.",
    h1: "How to Ask Your Crush Out",
    intro:
      "To ask your crush out, pick a private moment, give a genuine compliment, and suggest a specific plan with an easy yes: \"I've really enjoyed getting to know you — would you want to grab coffee Saturday?\" Confidence and a clear plan beat hints every time.",
    sections: [
      {
        heading: "Before you ask",
        bullets: [
          "You've talked at least a little — it's not out of nowhere",
          "You've spoken recently, not months ago",
          "It's a calm moment, not a stressful one",
          "You're ready to suggest a real, specific plan",
        ],
      },
      {
        heading: "The perfect ask, step by step",
        steps: [
          { name: "Open warmly", text: "A genuine compliment about something specific." },
          { name: "Make it clear it's romantic", text: "Use the word \"date\" so there's no guessing." },
          { name: "Suggest a real plan", text: "A place and a time, not \"sometime.\"" },
          { name: "Give an easy out", text: "\"No worries if you're busy\" lowers the pressure." },
        ],
      },
      {
        heading: "A cute, low-pressure way to ask",
        body: [
          "If asking face-to-face feels like a lot, a personalized invitation does the brave part for you. Add a photo, your message, and the plan — they open it on their own time and respond.",
          "It's especially good for an online crush, where a thoughtful page lands far better than a plain text.",
        ],
      },
      {
        heading: "If they say no",
        body: [
          "Be gracious: \"I appreciate the honesty — no hard feelings.\" Don't push, don't ask why, and keep your dignity.",
          "You asked. That took courage, and it's always better than wondering.",
        ],
      },
    ],
    faq: [
      { q: "What if they're 'out of my league'?", a: "No one is. A confident, genuine ask is attractive — take your shot." },
      { q: "Should I confess my feelings first?", a: "No need. Let a clear, warm invitation show your interest." },
      { q: "Is it brave enough to ask online?", a: "Yes — a thoughtful, personalized invitation is just as brave and often lands better." },
      { q: "When's the best time?", a: "A relaxed midweek afternoon when they're not stressed or busy." },
    ],
    cta: {
      heading: "Ask your crush out beautifully",
      sub: "Let a personalized invitation do the brave part for you.",
    },
    related: [
      { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/templates/first-date", label: "First date invitation template" },
      { href: "/blog/asking-someone-out/ways-to-ask-your-crush-out", label: "Best ways to ask your crush out" },
    ],
  },

  boyfriend: {
    path: "/for/boyfriend",
    slug: "boyfriend",
    primaryKeyword: "cute way to ask boyfriend out",
    eyebrow: "For your boyfriend",
    title: "Cute Date Ideas & Invitations for Your Boyfriend | Whobela",
    description:
      "Plan a romantic date for your boyfriend with a personalized invitation. Cute ideas, surprise dates, and anniversary plans that make him feel special.",
    h1: "Create the Perfect Date Invitation for Your Boyfriend",
    intro:
      "A great way to surprise your boyfriend is a personalized date invitation built around what he loves — an experience, a favorite meal, or a surprise weekend. It shows ongoing effort and keeps your relationship feeling exciting, not settled.",
    sections: [
      {
        heading: "Why it works",
        bullets: [
          "Shows continued effort — you're still choosing him",
          "Creates anticipation and quality time",
          "Romantic without being over the top",
          "He feels pursued, too",
        ],
      },
      {
        heading: "Date ideas he'll love",
        bullets: [
          "An experience: a concert, game, or show",
          "A surprise weekend getaway",
          "A dressed-up dinner at home",
          "An adventure tied to his hobby",
        ],
      },
      {
        heading: "How to make him say yes",
        steps: [
          { name: "Make it specific", text: "A real plan beats \"we should do something.\"" },
          { name: "Center his favorites", text: "Build it around something he loves." },
          { name: "Send the invitation", text: "Share a personalized page he can respond to." },
          { name: "Lock in the time", text: "Let him pick a time on the spot." },
        ],
      },
    ],
    faq: [
      { q: "Is it weird to ask him out?", a: "Not at all — it's confident and keeps dating exciting, even years in." },
      { q: "Does this work for long-term couples?", a: "Especially then. Intentional date invitations keep the spark alive." },
    ],
    cta: { heading: "Plan a date he'll remember", sub: "Make it personal and let him pick the time." },
    related: [
      { href: "/templates/romantic-dinner", label: "Romantic dinner template" },
      { href: "/templates/surprise-date", label: "Surprise date template" },
      { href: "/occasions/anniversary", label: "Anniversary date ideas" },
      { href: "/for/couples", label: "Date ideas for couples" },
    ],
  },

  girlfriend: {
    path: "/for/girlfriend",
    slug: "girlfriend",
    primaryKeyword: "cute date invitation for girlfriend",
    eyebrow: "For your girlfriend",
    title: "Cute Date Invitation Ideas for Your Girlfriend | Whobela",
    description:
      "Make your girlfriend feel special with a personalized date invitation. Romantic ideas, surprise dates, and anniversary plans she'll adore.",
    h1: "Create a Date Invitation for Your Girlfriend",
    intro:
      "A personalized date invitation is a simple, romantic way to make your girlfriend feel chosen. Build it around a memory or something she loves, add your photos and a heartfelt message, and let her pick the time.",
    sections: [
      {
        heading: "Why it works",
        bullets: [
          "Small, consistent gestures matter most",
          "Shows you're thinking about her",
          "Turns an ordinary week into a moment",
          "Romantic without needing a grand gesture",
        ],
      },
      {
        heading: "Date ideas she'll love",
        bullets: [
          "A thoughtful dinner built around a memory",
          "A surprise day out",
          "A cozy at-home date night",
          "Something tied to her favorite thing",
        ],
      },
      {
        heading: "Make it personal",
        steps: [
          { name: "Recall a memory", text: "Reference a moment that's meaningful to you both." },
          { name: "Add your photos", text: "Use pictures of the two of you." },
          { name: "Write from the heart", text: "Say what she means to you." },
          { name: "Send and schedule", text: "Share the link and lock in a time." },
        ],
      },
    ],
    faq: [
      { q: "What if we've been together a while?", a: "Even better — a deliberate invitation reminds her you're still pursuing her." },
      { q: "Does it have to be expensive?", a: "No. Effort and thoughtfulness matter far more than money." },
    ],
    cta: { heading: "Make her feel chosen", sub: "A personal invitation she'll want to keep." },
    related: [
      { href: "/templates/romantic-dinner", label: "Romantic dinner template" },
      { href: "/occasions/valentines-day", label: "Valentine's Day date ideas" },
      { href: "/occasions/anniversary", label: "Anniversary date ideas" },
      { href: "/for/couples", label: "Date ideas for couples" },
    ],
  },

  couples: {
    path: "/for/couples",
    slug: "couples",
    primaryKeyword: "romantic date ideas for couples",
    eyebrow: "For couples",
    title: "Date Ideas for Couples — Keep the Spark Alive | Whobela",
    description:
      "Romantic date ideas for couples and an easy way to plan them. Anniversary celebrations, surprise dates, and at-home date nights.",
    h1: "Keep the Magic Alive: Date Ideas for Couples",
    intro:
      "The best date ideas for couples mix novelty with comfort — a surprise date night, an experience you've never tried, or a dressed-up evening at home. A personalized invitation makes even a familiar plan feel like an event worth looking forward to.",
    sections: [
      {
        heading: "Why couples still need date invitations",
        bullets: [
          "Breaks the 'just staying in' routine",
          "Creates shared anticipation",
          "Keeps quality time on the calendar",
          "Reignites the spark with small effort",
        ],
      },
      {
        heading: "Ideas by vibe",
        bullets: [
          "Romantic: candlelit dinner, recreate your first date",
          "Adventurous: hike, road trip, try something new",
          "Cozy: at-home date night, movie + real conversation",
          "Celebratory: anniversary, a milestone worth marking",
        ],
      },
      {
        heading: "Ask your partner out (yes, still)",
        body: [
          "Even years in, a specific, thoughtful invitation beats vague planning. It says: you still excite me.",
          "Set the plan, add a memory, and let them pick the time inside the invitation.",
        ],
      },
    ],
    faq: [
      { q: "How often should couples date?", a: "Weekly or biweekly is ideal; monthly at minimum. Consistency matters more than budget." },
      { q: "Is it cheesy to formally invite my partner?", a: "Not at all — it shows they're still worth the effort." },
    ],
    cta: { heading: "Plan your next date night", sub: "Turn an ordinary week into something to look forward to." },
    related: [
      { href: "/templates/anniversary", label: "Anniversary template" },
      { href: "/templates/surprise-date", label: "Surprise date template" },
      { href: "/occasions/anniversary", label: "Anniversary date ideas" },
      { href: "/blog/date-ideas/romantic-date-ideas-for-couples", label: "Romantic date ideas for couples" },
    ],
  },
};

export const AUDIENCE_SLUGS = Object.keys(AUDIENCE_PAGES);
export const AUDIENCE_LIST = Object.values(AUDIENCE_PAGES).map((p) => ({
  slug: p.slug,
  label: p.eyebrow ?? p.h1,
  href: p.path,
}));
