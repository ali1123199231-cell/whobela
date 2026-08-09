"use client";

import { useState } from "react";
import Link from "next/link";
import { DatePageView, type DatePageConfigBundle } from "./index";
import { ReportDialog } from "@/components/report-dialog";

export function LiveDatePageView({
  datePageId,
  config,
  photoUrls,
  isOwner,
  homeUrl,
  ctaUrl,
  username,
}: {
  datePageId: string;
  config: DatePageConfigBundle;
  photoUrls: string[];
  isOwner: boolean;
  /** Absolute, UTM-tagged link home — see the badge below. */
  homeUrl: string;
  /** Same, tagged separately so the two surfaces can be told apart. */
  ctaUrl: string;
  /** Identifies the page being reported; the reporter has no session to infer it from. */
  username: string;
}) {
  const [reporting, setReporting] = useState(false);

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
      <DatePageView
        datePageId={datePageId}
        mode="live"
        config={config}
        photoUrls={photoUrls}
        homeUrl={ctaUrl}
      />
      {/*
        The recipient of an invitation is the best prospect this product has —
        they're holding proof it works — and until now nothing on the page told
        them where it came from. Deliberately quiet: it sits under the owner's
        edit button and mustn't compete with the question being asked.
      */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5">
        <a
          href={homeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-rose-900/70 shadow-sm backdrop-blur-sm transition hover:bg-white/90 hover:text-rose-900"
        >
          Made with 🌸 whobela
        </a>
        {/*
          Sits beside the badge rather than in the flow of the invitation: the
          recipient never agreed to anything and may be looking at something
          they find threatening, so a way out has to be visible from the first
          screen — but it must not compete with the question being asked.
        */}
        {!isOwner && (
          <button
            onClick={() => setReporting(true)}
            className="rounded-full bg-white/50 px-2.5 py-1.5 text-xs font-medium text-rose-900/50 shadow-sm backdrop-blur-sm transition hover:bg-white/90 hover:text-rose-900"
          >
            Report
          </button>
        )}
      </div>

      {reporting && <ReportDialog username={username} onClose={() => setReporting(false)} />}
    </div>
  );
}
