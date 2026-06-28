import type { SeoPage } from "./types";

// §5.8 — occasion pages at /occasions/[slug].

export const OCCASION_PAGES: Record<string, SeoPage> = {
  "valentines-day": {
    path: "/occasions/valentines-day",
    slug: "valentines-day",
    primaryKeyword: "valentines date invitation",
    eyebrow: "💝 Valentine's Day",
    title: "Valentine's Day Date Ideas & Invitation | Whobela",
    description:
      "Plan the perfect Valentine's Day date. Creative invitation ideas, romantic plans for every budget, and a cute way to ask.",
    h1: "Valentine's Day Date Ideas They'll Actually Love",
    intro:
      "The best Valentine's Day dates feel personal, not obligatory — a dinner built around them, a cozy night in, or a small surprise. A personalized invitation takes the pressure off and turns the ask itself into part of the gift.",
    sections: [
      {
        heading: "Valentine's date ideas by budget",
        bullets: [
          "Under $50: candlelit dinner at home, a picnic, a handwritten gift",
          "$50–$150: a nice restaurant, a concert, a thoughtful gift + dinner",
          "$150+: an upscale dinner, a weekend away, a meaningful gift",
        ],
      },
      {
        heading: "How to invite them",
        body: [
          "Skip the generic flowers-and-text. Send a personalized invitation with your photo, your song, and a message about what they mean to you.",
          "Add the plan and let them say yes right on the page.",
        ],
      },
      {
        heading: "Avoid the common mistakes",
        bullets: [
          "Being generic instead of personal",
          "Overspending to prove something",
          "Leaving it to the last minute",
          "Forgetting what they actually enjoy",
        ],
      },
    ],
    faq: [
      { q: "What if they say they hate Valentine's Day?", a: "Make it low-key and personal — focus on them, not the holiday." },
      { q: "What if money is tight?", a: "Effort and presence beat money. A heartfelt at-home date is perfect." },
      { q: "When should I ask?", a: "A week or two ahead — it shows you planned and gives them time to look forward to it." },
    ],
    cta: { heading: "Make this Valentine's special", sub: "Create an invitation they'll remember." },
    related: [
      { href: "/templates/romantic-dinner", label: "Romantic dinner template" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
      { href: "/for/girlfriend", label: "Date ideas for your girlfriend" },
      { href: "/for/boyfriend", label: "Date ideas for your boyfriend" },
    ],
  },

  anniversary: {
    path: "/occasions/anniversary",
    slug: "anniversary",
    primaryKeyword: "anniversary date ideas",
    eyebrow: "💞 Anniversary",
    title: "Anniversary Date Ideas & Invitation | Whobela",
    description:
      "Celebrate your anniversary with a personalized invitation. Meaningful date ideas, ways to recreate your first date, and surprise plans.",
    h1: "Anniversary Date Ideas to Celebrate Your Love",
    intro:
      "Great anniversary dates honor your story — recreate your first date, return to a meaningful place, or try something new together. A personalized invitation that recalls a favorite memory makes the celebration feel as special as the milestone.",
    sections: [
      {
        heading: "Anniversary ideas",
        bullets: [
          "Recreate your very first date",
          "Return to a place that means something",
          "A weekend getaway",
          "A new experience you'll remember together",
        ],
      },
      {
        heading: "Make it meaningful",
        body: [
          "Use your photos to tell the story of your year, share what you're grateful for, and invite them to celebrate.",
          "Let them pick the time right inside the invitation.",
        ],
      },
    ],
    faq: [
      { q: "How do I make it feel special?", a: "Personalize it with memories and gratitude — that matters more than the venue." },
      { q: "Can it be a surprise?", a: "Yes — keep the details hidden and reveal them on the page." },
    ],
    cta: { heading: "Celebrate another year", sub: "An invitation as meaningful as the milestone." },
    related: [
      { href: "/templates/anniversary", label: "Anniversary template" },
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
    ],
  },

  "first-date": {
    path: "/occasions/first-date",
    slug: "first-date",
    primaryKeyword: "best first date ideas",
    eyebrow: "🌷 First date",
    title: "Best First Date Ideas (and How to Ask) | Whobela",
    description:
      "The best first date ideas that lead to a second — plus a low-pressure way to ask with a personalized invitation.",
    h1: "Best First Date Ideas That Lead to a Second",
    intro:
      "The best first dates are low-pressure and conversation-friendly: coffee, a relaxed walk, a casual activity. Keep it short and easy, and ask with a warm, personalized invitation so saying yes feels effortless.",
    sections: [
      {
        heading: "First date ideas that work",
        bullets: [
          "Coffee — easy, low-pressure, conversation-first",
          "A walk somewhere scenic",
          "A casual activity (mini golf, a market, a gallery)",
          "A relaxed lunch over dinner for nerves",
        ],
      },
      {
        heading: "How to ask for a first date",
        steps: [
          { name: "Keep it light", text: "Friendly and warm, not heavy." },
          { name: "Be specific", text: "A real plan and a time." },
          { name: "Lower the stakes", text: "A short, easy first plan." },
          { name: "Send an invitation", text: "Let a personalized page make it memorable." },
        ],
      },
    ],
    faq: [
      { q: "What makes a good first date?", a: "Low pressure and room to talk. Coffee or a walk beats anything elaborate." },
      { q: "How do I make a good impression?", a: "Be on time, be present, ask questions, and put your phone away." },
    ],
    cta: { heading: "Ask for that first date", sub: "Low pressure, high charm." },
    related: [
      { href: "/templates/first-date", label: "First date template" },
      { href: "/templates/coffee-date", label: "Coffee date template" },
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/blog/date-ideas/best-first-date-ideas", label: "Best first date ideas guide" },
    ],
  },

  birthday: {
    path: "/occasions/birthday",
    slug: "birthday",
    primaryKeyword: "birthday date ideas",
    eyebrow: "🎂 Birthday",
    title: "Birthday Date Ideas & Invitation | Whobela",
    description:
      "Plan a birthday date they'll love with a personalized invitation. Surprise ideas, romantic plans, and an easy way to ask.",
    h1: "Birthday Date Ideas for Someone Special",
    intro:
      "A birthday date is your chance to make someone feel celebrated. Build the day around what they love — a favorite meal, a surprise outing, an experience — and invite them with a personalized page that sets the tone.",
    sections: [
      {
        heading: "Birthday date ideas",
        bullets: [
          "Their favorite meal, done right",
          "A surprise outing or experience",
          "A day built entirely around them",
          "A nostalgic plan tied to a shared memory",
        ],
      },
      {
        heading: "Make the invitation part of the gift",
        body: [
          "Open with photos and a heartfelt birthday message, then reveal the plan.",
          "Let them pick the time so it fits their day.",
        ],
      },
    ],
    faq: [
      { q: "Should the birthday date be a surprise?", a: "It can be — drop a hint about the vibe so they're comfortable and excited." },
      { q: "How do I make it personal?", a: "Center the whole day on their favorite things and memories." },
    ],
    cta: { heading: "Make their birthday unforgettable", sub: "An invitation that's the start of the celebration." },
    related: [
      { href: "/templates/surprise-date", label: "Surprise date template" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
      { href: "/for/couples", label: "Date ideas for couples" },
    ],
  },

  proposal: {
    path: "/occasions/proposal",
    slug: "proposal",
    primaryKeyword: "creative marriage proposal ideas",
    eyebrow: "💍 Proposal",
    title: "Creative Marriage Proposal Ideas & Invitation | Whobela",
    description:
      "Creative marriage proposal ideas and a personal way to set the moment. Tell your story and ask the biggest question beautifully.",
    h1: "Creative Marriage Proposal Ideas",
    intro:
      "The most meaningful proposals are deeply personal — they tell your story and lead to the moment. A personalized invitation can be a beautiful part of how you propose: a build-up of memories, your song, and the question, alongside being there in person.",
    sections: [
      {
        heading: "Proposal ideas that feel personal",
        bullets: [
          "Recreate where you first met or your first date",
          "A story-driven build-up of your photos and memories",
          "A private, heartfelt reveal just for them",
          "Tie the moment to your song and your words",
        ],
      },
      {
        heading: "Set the moment",
        body: [
          "Use the proposal template to tell your story leading up to the question.",
          "Keep it private — only the person you send it to can open it.",
        ],
      },
    ],
    faq: [
      { q: "Should the whole proposal be digital?", a: "It works best as part of the moment — a meaningful build-up or reveal alongside being there in person." },
      { q: "How do I make it personal?", a: "Tell your real story with photos and memories, and say exactly why it's them." },
    ],
    cta: { heading: "Ask the biggest question beautifully", sub: "Tell your story, then ask." },
    related: [
      { href: "/templates/marriage-proposal", label: "Marriage proposal template" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
      { href: "/occasions/anniversary", label: "Anniversary date ideas" },
    ],
  },
};

export const OCCASION_SLUGS = Object.keys(OCCASION_PAGES);
export const OCCASION_LIST = Object.values(OCCASION_PAGES).map((p) => ({
  slug: p.slug,
  label: p.eyebrow ?? p.h1,
  href: p.path,
}));
