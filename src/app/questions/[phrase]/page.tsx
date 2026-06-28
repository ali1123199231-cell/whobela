import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { QUESTION_PAGES, QUESTION_SLUGS } from "@/content/questions";

export const revalidate = 86400;

export function generateStaticParams() {
  return QUESTION_SLUGS.map((phrase) => ({ phrase }));
}

export async function generateMetadata({ params }: { params: Promise<{ phrase: string }> }) {
  const { phrase } = await params;
  const page = QUESTION_PAGES[phrase];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noindex: page.noindex,
  });
}

export default async function QuestionPage({ params }: { params: Promise<{ phrase: string }> }) {
  const { phrase } = await params;
  const page = QUESTION_PAGES[phrase];
  if (!page) notFound();
  return <SeoPageView page={page} />;
}
