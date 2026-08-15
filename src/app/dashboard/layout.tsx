import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAppShell } from "@/lib/app-shell";
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

  // Inside the native app the tab bar is already on screen. Rendering this one
  // too would stack two rows of navigation that disagree about which tab is
  // selected.
  const inApp = await isAppShell();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-rose-50/40">
      <div className="flex-1">{children}</div>
      {!inApp && <BottomNav />}
    </div>
  );
}
