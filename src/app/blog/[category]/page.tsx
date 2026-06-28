import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { HubPage } from "@/components/marketing/hub-page";
import { BLOG_CATEGORIES, postsInCategory } from "@/content/blog";

export const revalidate = 86400;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} — The Whobela Blog`,
    description: cat.blurb,
    path: `/blog/${cat.slug}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();
  const posts = postsInCategory(category);
  return (
    <HubPage
      eyebrow="Blog"
      h1={cat.name}
      intro={cat.blurb}
      items={posts.map((post) => ({
        href: `/blog/${post.categorySlug}/${post.slug}`,
        title: post.h1,
        description: post.description,
        emoji: "📝",
      }))}
    />
  );
}
