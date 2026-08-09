"use client";

import Link from "next/link";
import { DatePageView, type DatePageConfigBundle } from "./index";

export function LiveDatePageView({
  datePageId,
  config,
  photoUrls,
  isOwner,
  homeUrl,
}: {
  datePageId: string;
  config: DatePageConfigBundle;
  photoUrls: string[];
  isOwner: boolean;
  /** Absolute, UTM-tagged link home — see the badge below. */
  homeUrl: string;
}) {
  return (
    <div className="relative">
      {isOwner && (
        <Link
          href="/dashboard/page"
          className="fixed bottom-4 right-4 z-50 rounded-full bg-rose-950/90 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          Edit your page
        </Link>
      )}
      <DatePageView datePageId={datePageId} mode="live" config={config} photoUrls={photoUrls} />
      {/*
        The recipient of an invitation is the best prospect this product has —
        they're holding proof it works — and until now nothing on the page told
        them where it came from. Deliberately quiet: it sits under the owner's
        edit button and mustn't compete with the question being asked.
      */}
      <a
        href={homeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-40 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-rose-900/70 shadow-sm backdrop-blur-sm transition hover:bg-white/90 hover:text-rose-900"
      >
        Made with 🌸 whobela
      </a>
    </div>
  );
}
