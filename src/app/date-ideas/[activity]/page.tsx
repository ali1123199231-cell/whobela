import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { DATE_IDEA_PAGES, DATE_IDEA_SLUGS } from "@/content/date-ideas";

export const revalidate = 86400;

export function generateStaticParams() {
  return DATE_IDEA_SLUGS.map((activity) => ({ activity }));
}

export async function generateMetadata({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  const page = DATE_IDEA_PAGES[activity];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noindex: page.noindex, // quality gate: noindex until promoted
  });
}

export default async function DateIdeaPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  const page = DATE_IDEA_PAGES[activity];
  if (!page) notFound();
  return <SeoPageView page={page} />;
}
