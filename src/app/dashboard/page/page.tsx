import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isShowcaseAccount } from "@/lib/showcase";
import { PageTabClient } from "./page-tab-client";

export default async function PageTab() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [datePage, photos, subscription, isShowcase] = await Promise.all([
    prisma.datePage.upsert({
      where: { userId: session.userId },
      update: {},
      create: { userId: session.userId, name: "My date page" },
    }),
    prisma.media.findMany({
      where: { userId: session.userId, kind: "PROFILE_PHOTO" },
      orderBy: { order: "asc" },
    }),
    prisma.subscription.findUnique({ where: { userId: session.userId } }),
    isShowcaseAccount(session.username),
  ]);

  const rootDomain = process.env.ROOT_DOMAIN ?? "localhost:3000";
  const isLocal = rootDomain.startsWith("localhost");
  const liveUrl = isLocal
    ? `http://${rootDomain}/preview/${session.username}`
    : `https://${session.username}.${rootDomain}`;

  // Server Component, rendered once per request — seeding client state from
  // the server's clock here (rather than the client calling Date.now() in
  // its own initializer) is what avoids a hydration mismatch; see
  // page-tab-client.tsx. Not subject to the re-render purity concern the
  // lint rule is guarding against for Client Components.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();

  return (
    <PageTabClient
      datePage={datePage}
      photos={photos.map((p) => ({ id: p.id, url: `/api/media/${p.id}` }))}
      subscriptionActive={subscription?.status === "ACTIVE" || isShowcase}
      liveUrl={liveUrl}
      initialNow={initialNow}
    />
  );
}
