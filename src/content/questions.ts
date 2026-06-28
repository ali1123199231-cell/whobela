import type { SeoPage } from "./types";

// §6.2 — programmatic /questions/[phrase]. Captures the exact phrases people
// search when they want the words to say. Shipped noindex,follow (quality gate).

type QuestionDef = {
  slug: string;
  phrase: string; // the exact question
  keyword: string;
  when: string;
  why: string;
  inPerson: string;
  viaText: string;
};

const QUESTIONS: QuestionDef[] = [
  {
    slug: "will-you-go-on-a-date-with-me",
    phrase: "Will you go on a date with me?",
    keyword: "will you go on a date with me",
    when: "After a few good conversations, when attraction seems mutual.",
    why: "It's clear and confident — no hints, no guessing. They know exactly what you're asking.",
    inPerson: "Relaxed tone, eye contact, a smile: \"Would you want to go on a date with me?\"",
    viaText: "Keep it simple and add a plan: \"Want to go on a date with me Saturday?\"",
  },
  {
    slug: "want-to-grab-coffee",
    phrase: "Want to grab coffee?",
    keyword: "want to grab coffee",
    when: "Early days, or when you want a low-pressure first date.",
    why: "Coffee is the easy yes — casual, short, and conversation-first.",
    inPerson: "\"I'd love to grab coffee with you sometime this week — are you free?\"",
    viaText: "\"Coffee Saturday? I know a great spot.\"",
  },
  {
    slug: "dinner-this-saturday",
    phrase: "Dinner this Saturday?",
    keyword: "asking someone to dinner",
    when: "When you're ready for a real, intentional date.",
    why: "Naming the day shows you've thought about it and makes it easy to say yes.",
    inPerson: "\"I'd really like to take you to dinner this Saturday.\"",
    viaText: "\"Dinner Saturday? I'll pick somewhere you'll love.\"",
  },
  {
    slug: "are-you-free-saturday",
    phrase: "Are you free Saturday?",
    keyword: "are you free saturday",
    when: "When you want to gauge availability before sharing the plan.",
    why: "It opens the door gently, then you reveal the plan.",
    inPerson: "\"Are you free Saturday? I'd love to take you out.\"",
    viaText: "\"Free Saturday? I've got a date idea for us.\"",
  },
  {
    slug: "can-i-take-you-out",
    phrase: "Can I take you out?",
    keyword: "can i take you out",
    when: "When you want to be clearly romantic and a little charming.",
    why: "It's warm, confident, and unmistakably a date.",
    inPerson: "\"You're wonderful — can I take you out this week?\"",
    viaText: "\"Can I take you out Friday? I'd really like to.\"",
  },
  {
    slug: "will-you-be-my-valentine",
    phrase: "Will you be my Valentine?",
    keyword: "will you be my valentine",
    when: "Leading up to Valentine's Day.",
    why: "Sweet and classic — perfect with a personal touch and a plan.",
    inPerson: "\"Will you be my Valentine this year?\"",
    viaText: "\"Will you be my Valentine? I've got something planned.\"",
  },
];

function buildQuestionPage(def: QuestionDef): SeoPage {
  return {
    path: `/questions/${def.slug}`,
    slug: def.slug,
    primaryKeyword: def.keyword,
    eyebrow: "💬 How to ask",
    title: `How to Ask: “${def.phrase}” | Whobela`,
    description: `How to ask “${def.phrase}” — when to say it, exactly how, and a cute way to make it memorable.`,
    h1: `How to Ask: “${def.phrase}”`,
    intro: `${def.why} ${def.when} Here's exactly how to say it — in person or by message — plus a way to make it unforgettable with a personalized invitation.`,
    sections: [
      { heading: "When to ask", body: [def.when] },
      { heading: "Why it works", body: [def.why] },
      {
        heading: "How to say it",
        bullets: [`In person: ${def.inPerson}`, `By message: ${def.viaText}`],
      },
      {
        heading: "Make it memorable",
        body: [
          "Want it to land even better? Turn the question into a personalized invitation — add a photo, your message, and the plan, then share one private link.",
          "It gives them space to say yes and turns the ask into a moment.",
        ],
      },
    ],
    faq: [
      { q: "Is this too direct?", a: "Direct is good — it's confident and respectful, and it gives them a clear question to answer." },
      { q: "In person or by text?", a: "If you know them well, in person is lovely. Otherwise a personalized invitation is clear and low-pressure." },
    ],
    cta: { heading: "Ask it beautifully", sub: "Turn the question into a personalized invitation." },
    related: [
      { href: "/questions", label: "More ways to ask" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
    noindex: true,
  };
}

export const QUESTION_PAGES: Record<string, SeoPage> = Object.fromEntries(
  QUESTIONS.map((q) => [q.slug, buildQuestionPage(q)]),
);

export const QUESTION_LIST = QUESTIONS.map((q) => ({ slug: q.slug, phrase: q.phrase }));
export const QUESTION_SLUGS = QUESTIONS.map((q) => q.slug);
