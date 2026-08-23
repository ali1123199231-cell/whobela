"use client";

import { useEffect, useState } from "react";
import { PlayBadge } from "@/components/play-badge";
import { useIsAndroid, useStandalone } from "@/lib/device";

// Chrome fires this instead of showing its own install UI once the page
// qualifies; holding onto it lets us put the prompt behind a button of our own.
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const standalone = useStandalone();
  const android = useIsAndroid();
  const installed = standalone || justInstalled;

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setJustInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Standalone covers the Play build too: the Android app is a Trusted Web
  // Activity rendering this page, so it reports standalone and correctly never
  // offers to install the thing it already is.
  if (installed) {
    return <p className="text-sm text-rose-700/60">Whobela is installed on this device ✓</p>;
  }

  // Android goes to Play rather than the browser's own install prompt, even
  // though that prompt works and is one tap shorter. A home-screen PWA can
  // never be rated or ranked, so every install routed around the Store is a
  // review the app cannot receive and a ranking signal Play never sees —
  // which is the whole reason for publishing it there.
  if (android) {
    return (
      <div className="flex flex-col gap-2">
        <PlayBadge />
        <p className="text-xs text-rose-700/50">
          Ratings help other people find Whobela — if it worked for you, we&apos;d love one.
        </p>
      </div>
    );
  }

  // No event means the browser won't install this — either it already did, or
  // it's iOS Safari, which has no API and needs the manual route.
  if (!promptEvent) {
    return (
      <p className="text-sm text-rose-700/60">
        To install: open your browser menu and choose <strong>Add to Home Screen</strong>.
      </p>
    );
  }

  return (
    <button
      onClick={async () => {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        // The event is single-use; a dismissal means we can't ask again this
        // page load, so drop it and fall back to the manual instructions.
        setPromptEvent(null);
        if (outcome === "accepted") setJustInstalled(true);
      }}
      className="w-fit rounded-full bg-rose-500 px-4 py-1.5 text-sm font-semibold text-white"
    >
      Install the app
    </button>
  );
}
