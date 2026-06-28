import { buildMetadata } from "@/lib/seo/metadata";
import { HubPage } from "@/components/marketing/hub-page";
import { DATE_IDEA_LIST } from "@/content/date-ideas";

export const metadata = buildMetadata({
  title: "Date Ideas — Plans for Every Vibe & Budget | Whobela",
  description:
    "Browse date ideas for every vibe and budget — coffee dates, dinners, hikes, picnics, and more. Pick one and turn it into a personalized invitation.",
  path: "/date-ideas",
});

export default function DateIdeasHub() {
  return (
    <HubPage
      eyebrow="Date ideas"
      h1="Date Ideas for Every Vibe"
      intro="Need inspiration? Browse date ideas by vibe and budget, then turn any of them into a personalized invitation in minutes."
      columns={3}
      items={DATE_IDEA_LIST.map((d) => ({
        href: `/date-ideas/${d.slug}`,
        title: d.name,
        description: d.vibe,
        emoji: d.emoji,
      }))}
    />
  );
}
