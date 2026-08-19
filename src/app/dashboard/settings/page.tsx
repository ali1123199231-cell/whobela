import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVapidPublicKey } from "@/lib/push";
import { isAppShell } from "@/lib/app-shell";
import { SettingsTabClient } from "./settings-tab-client";

export default async function SettingsTab() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, datePage, vapidPublicKey] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.datePage.upsert({
      where: { userId: session.userId },
      update: {},
      create: { userId: session.userId, name: "My date page" },
    }),
    getVapidPublicKey(),
  ]);
  if (!user) redirect("/login");

  // Inside the app, browser push and a "get the app" badge are both nonsense:
  // the WebView has no Notification API, so the toggle can only ever say it
  // cannot work, and the app is already installed.
  const inApp = await isAppShell();

  return (
    <SettingsTabClient
      email={user.email}
      emailNotificationsEnabled={user.emailNotificationsEnabled}
      username={session.username}
      customDomain={datePage.customDomain}
      customDomainVerified={Boolean(datePage.customDomainVerifiedAt)}
      vapidPublicKey={vapidPublicKey}
      inApp={inApp}
    />
  );
}
