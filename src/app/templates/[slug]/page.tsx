import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { TEMPLATE_PAGES, TEMPLATE_SLUGS } from "@/content/templates";

export const revalidate = 86400; // ISR

export function generateStaticParams() {
  return TEMPLATE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = TEMPLATE_PAGES[slug];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noindex: page.noindex,
  });
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = TEMPLATE_PAGES[slug];
  if (!page) notFound();
  return <SeoPageView page={page} />;
}
