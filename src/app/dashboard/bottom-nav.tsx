"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard/page", label: "Page", emoji: "💌" },
  { href: "/dashboard/inbox", label: "Inbox", emoji: "❤️" },
  { href: "/dashboard/profile", label: "Profile", emoji: "🙂" },
  { href: "/dashboard/settings", label: "Settings", emoji: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 flex border-t border-rose-100 bg-white">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              active ? "text-rose-600" : "text-rose-300"
            }`}
          >
            <span className={`text-xl ${active ? "" : "opacity-60"}`}>{tab.emoji}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
