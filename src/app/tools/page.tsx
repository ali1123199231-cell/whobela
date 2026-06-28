import { buildMetadata } from "@/lib/seo/metadata";
import { HubPage } from "@/components/marketing/hub-page";
import { TOOLS } from "@/content/tools";

export const metadata = buildMetadata({
  title: "Free Dating Tools — Generators & Quizzes | Whobela",
  description:
    "Free tools to help you ask someone out: a date idea generator, a how-to-ask quiz, first date questions, and cute ways to ask.",
  path: "/tools",
});

export default function ToolsHub() {
  return (
    <HubPage
      eyebrow="Free tools"
      h1="Free Dating Tools"
      intro="Quick, free helpers for the hardest part — asking. Generate ideas, find the words, then turn it into a personalized invitation."
      items={TOOLS.map((t) => ({
        href: `/tools/${t.slug}`,
        title: t.name,
        description: t.description,
        emoji: t.emoji,
      }))}
    />
  );
}
