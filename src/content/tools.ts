// §7 — free tools metadata. The interactive UI lives in each tool's route;
// this file holds SEO copy + the data some tools generate.

export type ToolDef = {
  slug: string;
  name: string;
  emoji: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
};

export const TOOLS: ToolDef[] = [
  {
    slug: "date-idea-generator",
    name: "Date Idea Generator",
    emoji: "🎲",
    title: "Free Date Idea Generator | Whobela",
    description:
      "Stuck for ideas? Generate a date idea instantly — filter by vibe and budget, then turn it into a personalized invitation.",
    h1: "Date Idea Generator",
    intro:
      "Tap the button for a fresh date idea. Filter by vibe and budget, find one you love, then turn it into a personalized invitation in minutes.",
  },
  {
    slug: "how-to-ask-someone-out-quiz",
    name: "How to Ask Someone Out Quiz",
    emoji: "💌",
    title: "How Should You Ask Them Out? Free Quiz | Whobela",
    description:
      "Answer a few questions and get a personalized approach for asking your crush out — plus the exact words to use.",
    h1: "How Should You Ask Them Out?",
    intro:
      "Answer a few quick questions about your situation and we'll suggest the best way to ask — and the words to say.",
  },
  {
    slug: "first-date-questions",
    name: "First Date Questions Generator",
    emoji: "💬",
    title: "First Date Questions Generator (Free) | Whobela",
    description:
      "Never run out of things to say. Generate great first date questions and conversation starters instantly.",
    h1: "First Date Questions Generator",
    intro:
      "Generate warm, fun first-date questions that actually spark conversation. Tap for a new set any time.",
  },
  {
    slug: "cute-ways-to-ask-generator",
    name: "Cute Ways to Ask Generator",
    emoji: "✨",
    title: "Cute Ways to Ask Someone Out — Idea Generator | Whobela",
    description:
      "Generate a cute, personalized way to ask someone out based on your relationship and vibe.",
    h1: "Cute Ways to Ask Generator",
    intro:
      "Tell us who you're asking and the vibe you want — we'll generate a cute way to pop the question.",
  },
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);
export function getTool(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
