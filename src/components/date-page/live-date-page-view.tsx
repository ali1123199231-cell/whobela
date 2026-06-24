"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DatePageView, type DatePageConfigBundle } from "./index";
import { formatCountdown } from "@/lib/date-page-status";

export function LiveDatePageView({
  datePageId,
  config,
  photoUrls,
  trialEndsAt,
  isOwner,
  initialNow,
}: {
  datePageId: string;
  config: DatePageConfigBundle;
  photoUrls: string[];
  trialEndsAt: string | null;
  isOwner: boolean;
  initialNow: number;
}) {
  // Seeded from the server's clock (via prop) rather than calling Date.now()
  // in the initializer, which would run again on hydration and produce a
  // different value than what was server-rendered, causing a mismatch.
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    if (!trialEndsAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [trialEndsAt]);

  const msLeft = trialEndsAt ? new Date(trialEndsAt).getTime() - now : null;

  return (
    <div className="relative">
      {msLeft !== null && msLeft > 0 && (
        <div className="sticky top-0 z-50 w-full bg-rose-900/85 py-1.5 text-center text-xs text-white">
          This page is active for {formatCountdown(msLeft)} more
        </div>
      )}
      {isOwner && (
        <Link
          href="/dashboard/page"
          className="fixed bottom-4 right-4 z-50 rounded-full bg-rose-950/90 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          Edit your page
        </Link>
      )}
      <DatePageView datePageId={datePageId} mode="live" config={config} photoUrls={photoUrls} />
    </div>
  );
}
