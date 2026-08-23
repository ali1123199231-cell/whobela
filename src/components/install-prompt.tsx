"use client";

import { PlayBadge } from "@/components/play-badge";
import { playStoreUrl } from "@/lib/app-store";

/**
 * Offers the Android app at the moment a page goes live.
 *
 * This is the highest-intent second Whobela has: the invitation is out, and
 * the only thing left to do is wait for an answer. It takes the place of the
 * web push prompt on Android rather than joining it — the app's notifications
 * are the same promise, delivered better, and two prompts stacked at one
 * moment is how both get dismissed.
 */
export function InstallPrompt({ onDismiss }: { onDismiss: () => void }) {
  return (
    // Matches the push prompt's modal exactly: same z-50 as the other overlays,
    // rendered after the sticky header so it sits above it.
    <div className="fixed inset-0 z-50 grid place-items-center bg-rose-950/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg shadow-rose-200">
        <p className="font-semibold text-rose-950">Your page is live 🎉</p>
        <p className="mt-1 text-sm text-rose-700/80">
          Get the free Android app and your phone buzzes the second someone says yes — no
          refreshing, no checking.
        </p>
        <div className="mt-4">
          <PlayBadge href={playStoreUrl("post_publish")} scale={0.24} />
        </div>
        <button onClick={onDismiss} className="mt-3 text-sm text-rose-400">
          Not now
        </button>
      </div>
    </div>
  );
}
