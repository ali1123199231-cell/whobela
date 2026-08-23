"use client";

import { useSyncExternalStore } from "react";
import { isAndroid } from "@/lib/app-store";

const STANDALONE = "(display-mode: standalone)";

// The OS never changes mid-session, so there is nothing to subscribe to — this
// is useSyncExternalStore purely for its server snapshot, which keeps the
// server's HTML (no navigator, so "not Android") from disagreeing with the
// client's first render.
const NEVER_CHANGES = () => () => {};

export function useIsAndroid(): boolean {
  return useSyncExternalStore(NEVER_CHANGES, isAndroid, () => false);
}

/**
 * Whether the page is running as an installed app rather than in a browser tab.
 *
 * Read as an external store rather than in an effect: the server has no
 * matchMedia, and subscribing keeps the answer right if the app is launched
 * from the home screen while this tab is open.
 */
export function useStandalone(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(STANDALONE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(STANDALONE).matches,
    () => false
  );
}
