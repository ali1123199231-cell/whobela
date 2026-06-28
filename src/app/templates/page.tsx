import { buildMetadata } from "@/lib/seo/metadata";
import { HubPage } from "@/components/marketing/hub-page";
import { TEMPLATE_LIST } from "@/content/templates";

export const metadata = buildMetadata({
  title: "Date Invitation Templates — Romantic, Funny & Casual | Whobela",
  description:
    "Browse beautiful date invitation templates for every moment — first dates, romantic dinners, anniversaries, proposals, and more. Personalize and share in minutes.",
  path: "/templates",
});

export default function TemplatesHub() {
  return (
    <HubPage
      eyebrow="Templates"
      h1="Date Invitation Templates"
      intro="Start from a beautiful template, make it yours, and share one private link. There's a design for every moment — from a casual coffee to a marriage proposal."
      columns={3}
      items={TEMPLATE_LIST.map((t) => ({
        href: `/templates/${t.slug}`,
        title: `${t.name} Template`,
        description: t.description,
        emoji: t.emoji,
      }))}
    />
  );
}
