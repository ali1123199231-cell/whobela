import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVapidPublicKey } from "@/lib/push";
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

  const serverIp = process.env.SERVER_IP ?? null;

  return (
    <SettingsTabClient
      email={user.email}
      emailNotificationsEnabled={user.emailNotificationsEnabled}
      username={session.username}
      customDomain={datePage.customDomain}
      customDomainVerified={Boolean(datePage.customDomainVerifiedAt)}
      serverIp={serverIp}
      vapidPublicKey={vapidPublicKey}
    />
  );
}
