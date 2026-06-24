import type { Metadata } from "next";
import { PublicDatePage } from "@/components/date-page/public-page";
import { getLiveDatePageByUsername } from "@/lib/date-page";
import { withDefaults, DEFAULT_INVITE_CONFIG } from "@/lib/date-page-defaults";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const result = await getLiveDatePageByUsername(username);
  if (result.state !== "live") {
    return { title: "whobela — Create a magical way to ask someone out" };
  }

  const invite = withDefaults(result.datePage.inviteConfig, DEFAULT_INVITE_CONFIG);
  const title = result.firstName ? `${result.firstName} has something to ask you 💌` : invite.question;
  return {
    title,
    description: "Open this link to see your invitation ❤️",
  };
}

export default async function PublicSitePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <PublicDatePage username={username} />;
}
