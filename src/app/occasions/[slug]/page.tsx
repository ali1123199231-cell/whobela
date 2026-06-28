import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { OCCASION_PAGES, OCCASION_SLUGS } from "@/content/occasions";

export const revalidate = 86400;

export function generateStaticParams() {
  return OCCASION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = OCCASION_PAGES[slug];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noindex: page.noindex,
  });
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = OCCASION_PAGES[slug];
  if (!page) notFound();
  return <SeoPageView page={page} />;
}
