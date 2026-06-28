import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { MONEY_PAGES } from "@/content/money-pages";

const page = MONEY_PAGES["cute-ways-to-ask-someone-out"];

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function Page() {
  return <SeoPageView page={page} />;
}
