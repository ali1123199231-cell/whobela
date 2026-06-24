import { notFound } from "next/navigation";
import { getLiveDatePageByUsername } from "@/lib/date-page";
import { getSession } from "@/lib/auth";
import { LiveDatePageView } from "./live-date-page-view";

export async function PublicDatePage({ username }: { username: string }) {
  const result = await getLiveDatePageByUsername(username);
  if (result.state === "not-found") notFound();

  if (result.state === "expired") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gradient-to-b from-rose-100 to-pink-200 px-6 text-center">
        <span className="text-5xl">💤</span>
        <p className="text-xl font-semibold text-rose-900">This page took a little nap</p>
        <p className="text-rose-700/70">Ask its owner to renew it to see it again.</p>
      </div>
    );
  }

  const session = await getSession();
  const isOwner = session?.userId === result.ownerUserId;

  // Server Component, rendered once per request — seeding client state from
  // the server's clock here avoids a hydration mismatch in LiveDatePageView's
  // countdown. Not subject to the re-render purity concern the lint rule is
  // guarding against for Client Components.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();

  return (
    <LiveDatePageView
      datePageId={result.datePage.id}
      config={result.datePage}
      photoUrls={result.photoMediaIds.map((id) => `/api/media/${id}`)}
      trialEndsAt={result.trialEndsAt ? result.trialEndsAt.toISOString() : null}
      isOwner={isOwner}
      initialNow={initialNow}
    />
  );
}
