import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { COMPARISON_PAGES, COMPARISON_SLUGS } from "@/content/comparisons";

export const revalidate = 86400;

export function generateStaticParams() {
  return COMPARISON_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = COMPARISON_PAGES[slug];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noindex: page.noindex,
  });
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = COMPARISON_PAGES[slug];
  if (!page) notFound();
  return <SeoPageView page={page} />;
}
