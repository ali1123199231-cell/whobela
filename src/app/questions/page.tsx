import { buildMetadata } from "@/lib/seo/metadata";
import { HubPage } from "@/components/marketing/hub-page";
import { QUESTION_LIST } from "@/content/questions";

export const metadata = buildMetadata({
  title: "How to Ask: The Exact Words to Use | Whobela",
  description:
    "The exact words to ask someone out — when to say them, how, and a cute way to make any question memorable.",
  path: "/questions",
});

export default function QuestionsHub() {
  return (
    <HubPage
      eyebrow="How to ask"
      h1="The Exact Words to Ask Them Out"
      intro="Not sure how to phrase it? Pick the question you want to ask and get the words to say — plus a way to make it memorable."
      items={QUESTION_LIST.map((q) => ({
        href: `/questions/${q.slug}`,
        title: `“${q.phrase}”`,
        emoji: "💬",
      }))}
    />
  );
}
