"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Chrome fires this instead of showing its own install UI once the page
// qualifies; holding onto it lets us put the prompt behind a button of our own.
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STANDALONE = "(display-mode: standalone)";

// Read as an external store rather than in an effect: the server has no
// matchMedia, and subscribing keeps the answer right if the app is launched
// from the home screen while this tab is open.
function useStandalone(): boolean {
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

export function InstallApp() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const standalone = useStandalone();
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

  if (installed) {
    return <p className="text-sm text-rose-700/60">Whobela is installed on this device ✓</p>;
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
