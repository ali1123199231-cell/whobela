import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RESEND_COOLDOWN_MS } from "@/lib/email-verification";
import { VerifyEmailClient } from "./verify-email-client";

export default async function VerifyEmailPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");
  if (user.emailVerifiedAt) redirect("/dashboard/page");

  // Server Component, rendered once per request — seeding the resend
  // cooldown countdown from the server's clock here avoids a hydration
  // mismatch in the client component. Not subject to the re-render purity
  // concern the lint rule is guarding against for Client Components.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();

  const cooldownRemainingMs = user.verificationCodeSentAt
    ? Math.max(0, RESEND_COOLDOWN_MS - (initialNow - user.verificationCodeSentAt.getTime()))
    : 0;

  return <VerifyEmailClient email={user.email} initialNow={initialNow} cooldownRemainingMs={cooldownRemainingMs} />;
}
