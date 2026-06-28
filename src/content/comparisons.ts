import type { SeoPage } from "./types";

// §5.9 — comparison pages at /vs/[slug]. /vs/dating-apps is the entity-defining
// page: "Whobela is not a dating app."

export const COMPARISON_PAGES: Record<string, SeoPage> = {
  "dating-apps": {
    path: "/vs/dating-apps",
    slug: "dating-apps",
    primaryKeyword: "dating app alternative",
    eyebrow: "Whobela vs. dating apps",
    title: "Whobela vs. Dating Apps — Why It's Different | Whobela",
    description:
      "Whobela isn't a dating app. Dating apps help you meet strangers; Whobela helps you ask someone you already know on a date, beautifully.",
    h1: "Whobela Isn't a Dating App (Here's Why That's Better)",
    intro:
      "Whobela is not a dating app. Dating apps help you meet strangers and swipe through options. Whobela helps you ask someone you already know — a crush, a friend, your partner — on a date in a memorable, personal way. Different problem, different tool.",
    sections: [
      {
        heading: "The difference at a glance",
        bullets: [
          "Dating apps: meet new people, browse many options, start from zero",
          "Whobela: one person you already like, a personal invitation, a real moment",
        ],
      },
      {
        heading: "Why asking someone you know is better",
        bullets: [
          "They probably already like you — lower rejection risk",
          "You share context and a real conversation history",
          "It's more likely to lead to an actual date",
          "Even a no is gentler when you already know each other",
        ],
      },
      {
        heading: "Better together",
        body: [
          "Met on a dating app and had great conversations? Whobela is how you 'graduate' to a real date — send a personalized invitation that shows you're serious and romantic.",
          "It's the step after the match, not a replacement for it.",
        ],
      },
    ],
    faq: [
      { q: "Is Whobela a dating app?", a: "No. It's a tool for asking someone you already know on a date in a memorable way — not for matching with strangers." },
      { q: "Can I use it with someone I met on an app?", a: "Yes — it's a great way to turn a promising match into a real, romantic first date." },
      { q: "Do I need their account or number?", a: "Just a way to send them your private link — a text, DM, or QR code." },
    ],
    cta: { heading: "Ask someone you actually know", sub: "Turn a connection into a real date." },
    related: [
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
    ],
  },

  "text-message": {
    path: "/vs/text-message",
    slug: "text-message",
    primaryKeyword: "asking someone out over text",
    eyebrow: "Text vs. invitation",
    title: "Text Message vs. a Personalized Invitation | Whobela",
    description:
      "Should you ask someone out over text or with a personalized invitation? Compare both, and learn when each works best.",
    h1: "Text Message vs. a Beautiful Invitation: Which Should You Use?",
    intro:
      "Both can work, but they send different signals. A text is fast and casual — easy to ignore or forget. A personalized invitation shows real effort and gives the moment weight, which is why it tends to get a warmer yes for an actual date.",
    sections: [
      {
        heading: "When a text is fine",
        bullets: [
          "You're already dating",
          "It's a casual, last-minute plan",
          "You know them well and a big gesture would feel odd",
        ],
      },
      {
        heading: "When an invitation wins",
        bullets: [
          "It's the first time you're asking them out",
          "You want them to feel special",
          "It's a real date, not a casual hangout",
          "You're asking someone you met online",
        ],
      },
      {
        heading: "The difference it makes",
        body: [
          "A text feels like an afterthought; an invitation feels like a moment. One gets a shrug, the other gets a screenshot.",
          "You can even send both: a personalized invitation link with a short \"made this for you\" text.",
        ],
      },
    ],
    faq: [
      { q: "Is a text too casual to ask someone out?", a: "For a first ask or a real date, usually yes — a personalized invitation shows more care." },
      { q: "Can I do both?", a: "Yes — send the invitation link with a short friendly text pointing to it." },
    ],
    cta: { heading: "Make it more than a text", sub: "Send something they'll want to keep." },
    related: [
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
    ],
  },

  "traditional-invitation": {
    path: "/vs/traditional-invitation",
    slug: "traditional-invitation",
    primaryKeyword: "digital invitation vs paper",
    eyebrow: "Digital vs. paper",
    title: "Digital Invitation vs. Traditional Paper Invite | Whobela",
    description:
      "Compare a digital, interactive Whobela invitation with a traditional paper invite. See why digital is more personal, instant, and trackable.",
    h1: "Whobela vs. a Traditional Invitation",
    intro:
      "A traditional paper invitation is lovely but static and slow. A Whobela invitation is digital and interactive: they respond on the page, share preferences, and pick a time — and you know the moment they've opened it. It's the same romance, made effortless.",
    sections: [
      {
        heading: "What digital adds",
        bullets: [
          "Interactive — they respond and schedule right on the page",
          "Instant — share a link in seconds, see when it's opened",
          "Personal — add photos, music, and custom questions",
          "Trackable — know they received and responded",
        ],
      },
      {
        heading: "When paper still shines",
        body: [
          "A handwritten note has its own magic for certain moments.",
          "You can have both — pair a keepsake card with a Whobela link that handles the response and the plan.",
        ],
      },
    ],
    faq: [
      { q: "Is digital less romantic than paper?", a: "Not when it's personalized — photos, music, and your words make it deeply personal, plus it's interactive." },
      { q: "Can I combine the two?", a: "Yes — a paper keepsake plus a digital link is a lovely combination." },
    ],
    cta: { heading: "Send a living invitation", sub: "Personal, interactive, and instant." },
    related: [
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
      { href: "/templates", label: "Browse invitation templates" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
};

export const COMPARISON_SLUGS = Object.keys(COMPARISON_PAGES);
export const COMPARISON_LIST = Object.values(COMPARISON_PAGES).map((p) => ({
  slug: p.slug,
  label: p.eyebrow ?? p.h1,
  href: p.path,
}));
