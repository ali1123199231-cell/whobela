import { buildMetadata } from "@/lib/seo/metadata";
import { SeoPageView } from "@/components/marketing/seo-page-view";
import { MONEY_PAGES } from "@/content/money-pages";

const page = MONEY_PAGES["ask-someone-out-online"];

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function Page() {
  return <SeoPageView page={page} />;
}
