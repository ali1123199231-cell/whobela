import type { Metadata } from "next";
import { SITE, siteUrl, defaultOgImage } from "./site";

type BuildMetadataArgs = {
  title: string;
  description: string;
  /** Canonical path, e.g. "/templates/coffee-date". */
  path: string;
  /** Programmatic quality gate: ship noindex,follow until the page earns impressions. */
  noindex?: boolean;
  ogType?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
};

/**
 * Single source of truth for page metadata: title, description, self-referencing
 * canonical, robots directive, Open Graph and Twitter cards.
 */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  ogType = "website",
  image,
  publishedTime,
  modifiedTime,
  authorName,
}: BuildMetadataArgs): Metadata {
  const url = siteUrl(path);
  const ogImage = image ?? defaultOgImage();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: ogType,
      images: [{ url: ogImage }],
      ...(ogType === "article"
        ? { publishedTime, modifiedTime, authors: authorName ? [authorName] : undefined }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE.twitter,
      images: [ogImage],
    },
  };
}
