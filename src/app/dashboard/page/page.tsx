import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVapidPublicKey } from "@/lib/push";
import { isFeatureEnabled, CONFIG_KEYS } from "@/lib/config";
import { isAppShell } from "@/lib/app-shell";
import { PageTabClient } from "./page-tab-client";

export default async function PageTab() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [datePage, photos, vapidPublicKey, installPromptAllowed, inApp] = await Promise.all([
    prisma.datePage.upsert({
      where: { userId: session.userId },
      update: {},
      create: { userId: session.userId, name: "My date page" },
    }),
    prisma.media.findMany({
      where: { userId: session.userId, kind: "PROFILE_PHOTO" },
      orderBy: { order: "asc" },
    }),
    getVapidPublicKey(),
    isFeatureEnabled(CONFIG_KEYS.APP_INSTALL_POSTPUBLISH_ENABLED),
    isAppShell(),
  ]);

  const rootDomain = process.env.ROOT_DOMAIN ?? "localhost:3000";
  const isLocal = rootDomain.startsWith("localhost");
  const liveUrl = isLocal
    ? `http://${rootDomain}/preview/${session.username}`
    : `https://${session.username}.${rootDomain}`;

  return (
    <PageTabClient
      datePage={datePage}
      photos={photos.map((p) => ({ id: p.id, url: `/api/media/${p.id}` }))}
      liveUrl={liveUrl}
      vapidPublicKey={vapidPublicKey}
      installPromptEnabled={installPromptAllowed && !inApp}
      inApp={inApp}
    />
  );
}
