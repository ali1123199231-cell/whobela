import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo/metadata";
import { CreateClient } from "./create-client";

// noindex on purpose. /create-date-invitation is the money page that targets
// this query and is already in the sitemap; a second indexable page about
// making an invitation would only split the two. This one is the tool those
// pages send people to, not a landing page in its own right.
export const metadata = buildMetadata({
  title: "Make your date invitation — Whobela",
  description:
    "Build a personalized date invitation page. Change the question, the buttons and the theme, then save it and share the link.",
  path: "/create",
  noindex: true,
});

/**
 * The installed app's first screen, and the "try it" entry point from the
 * marketing pages.
 *
 * Signed-in visitors are bounced to the real editor: this is also the Android
 * app's start_url, so a returning user tapping the launcher icon must land on
 * the page they already own rather than a blank draft that would tempt them
 * into rebuilding it.
 */
export default async function CreatePage() {
  const session = await getSession();
  if (session) redirect("/dashboard/page");

  return <CreateClient />;
}
