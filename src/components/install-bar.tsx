"use client";

import { useEffect, useState } from "react";
import { PlayBadge } from "@/components/play-badge";
import { isAndroid, playRedirect } from "@/lib/app-store";

const DISMISSED_KEY = "whobela.install.bar.dismissed";
const DISMISSAL_DAYS = 30;

/**
 * Offers the Android app at the bottom of the marketing pages.
 *
 * The site is the only traffic Whobela has, and until this existed it never
 * mentioned the app outside the footer badge and a card behind the login wall —
 * so the Play listing sat at zero installs while the pages themselves kept
 * signing people up. This is the one route between those two facts.
 *
 * Deliberately a slim bar rather than an interstitial: Google demotes mobile
 * pages that cover their content with an install promo, and these are exactly
 * the pages whose search ranking is the point.
 */
export function InstallBar() {
  const [visible, setVisible] = useState(false);

  // Chrome offers the PWA on its own once the page qualifies, and on Android
  // that competes directly with the bar below: a home-screen PWA can never be
  // rated or ranked, so an install routed around the Store is a review the app
  // cannot receive and a ranking signal Play never sees — the same reasoning
  // install-app.tsx already applies on the dashboard. Preventing the event
  // suppresses Chrome's mini-infobar. Deliberately not conditional on the bar
  // being shown: if someone dismissed it, the answer is still "not the PWA".
  // Left alone off Android, where the PWA is the only thing on offer.
  useEffect(() => {
    if (!isAndroid()) return;
    const suppress = (event: Event) => event.preventDefault();
    window.addEventListener("beforeinstallprompt", suppress);
    return () => window.removeEventListener("beforeinstallprompt", suppress);
  }, []);

  useEffect(() => {
    // Nothing to offer anyone who can't install it, and nothing to offer from
    // inside a launched PWA — which is also how the site behaves when it is
    // already pinned to the home screen.
    if (!isAndroid()) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (dismissedRecently()) return;

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/app/install-prompt");
        if (!response.ok) return;
        const { enabled } = (await response.json()) as { enabled: boolean };
        if (!cancelled && enabled) setVisible(true);
      } catch {
        // Offline, or the endpoint is down. A missing install prompt is not
        // worth a console error on a page someone is trying to read.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Reserves the height the fixed bar covers, so the last thing on the
          page — usually the footer — is still reachable. Rendered only while
          the bar is, so nobody who never sees it pays for the whitespace. */}
      <div aria-hidden className="h-20" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rose-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          {/* Two short lines rather than one sentence: at phone widths — the
              only widths this bar appears at — a single line wrapped to three
              and crowded the badge. min-w-0 lets the text shrink instead of
              forcing the row wider than the screen. */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-rose-900">
              Know the second they answer
            </p>
            <p className="text-xs leading-snug text-rose-700/70">Free on Android</p>
          </div>
          <PlayBadge href={playRedirect("bar")} className="shrink-0" scale={0.2} />
          <button
            onClick={() => {
              // Remembered with a date rather than a flag: someone who says no
              // while reading a blog post in August is not saying no forever.
              try {
                window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
              } catch {
                // Private mode. Losing the dismissal is better than crashing.
              }
              setVisible(false);
            }}
            aria-label="Dismiss"
            className="shrink-0 rounded-full px-2 py-1 text-lg leading-none text-rose-300 transition hover:text-rose-500"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}

function dismissedRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISSAL_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
