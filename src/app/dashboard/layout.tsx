import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BottomNav } from "./bottom-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { emailVerifiedAt: true },
  });
  if (!user) redirect("/login");
  if (!user.emailVerifiedAt) redirect("/verify-email");

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-rose-50/40">
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
}
