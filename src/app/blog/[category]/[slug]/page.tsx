import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { BlogPostView } from "@/components/marketing/blog-post-view";
import { BLOG_SLUGS, getBlogPost } from "@/content/blog";

export const revalidate = 86400;

export function generateStaticParams() {
  return BLOG_SLUGS.map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = getBlogPost(category, slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.categorySlug}/${post.slug}`,
    ogType: "article",
    publishedTime: post.published,
    authorName: post.author,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = getBlogPost(category, slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
