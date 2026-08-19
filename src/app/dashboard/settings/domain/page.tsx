import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cnameTarget } from "@/lib/custom-domain";
import { DomainClient } from "./domain-client";

export const metadata = { title: "Your domain" };

export default async function DomainSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const datePage = await prisma.datePage.upsert({
    where: { userId: session.userId },
    update: {},
    create: { userId: session.userId, name: "My date page" },
  });

  return (
    <DomainClient
      username={session.username}
      rootDomain={(process.env.ROOT_DOMAIN ?? "localhost:3000").toLowerCase()}
      cnameTarget={cnameTarget()}
      customDomain={datePage.customDomain}
      verified={Boolean(datePage.customDomainVerifiedAt)}
      redirectVerified={Boolean(datePage.customDomainRedirectVerifiedAt)}
    />
  );
}
