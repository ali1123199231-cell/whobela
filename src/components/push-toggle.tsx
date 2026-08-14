"use client";

import { useEffect, useState } from "react";
import {
  disablePush,
  enablePush,
  getExistingSubscription,
  isPushSupported,
  registerServiceWorker,
} from "@/lib/pwa";
import { silencePrompt } from "@/lib/push-ask-record";

type State = "loading" | "unsupported" | "off" | "on" | "denied" | "unconfigured";

export function PushToggle({ vapidPublicKey }: { vapidPublicKey?: string | null }) {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isPushSupported()) {
        if (!cancelled) setState("unsupported");
        return;
      }
      // Registering here rather than only on opt-in means the worker is already
      // in place by the time someone taps the switch, and the browser has what
      // it needs to offer installation.
      await registerServiceWorker();
      if (Notification.permission === "denied") {
        if (!cancelled) setState("denied");
        return;
      }
      const subscription = await getExistingSubscription();
      if (!cancelled) setState(subscription ? "on" : "off");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleToggle(next: boolean) {
    setBusy(true);
    if (next) {
      const result = await enablePush(vapidPublicKey);
      setState(
        result === "enabled"
          ? "on"
          : result === "denied"
            ? "denied"
            : result === "unconfigured"
              ? "unconfigured"
              : result === "unsupported"
                ? "unsupported"
                : "off"
      );
    } else {
      await disablePush();
      // Someone who came to Settings and switched this off has given the
      // clearest "no" available. Without this, the contextual prompt would ask
      // them again on their very next visit to the inbox.
      silencePrompt();
      setState("off");
    }
    setBusy(false);
  }

  if (state === "loading") return null;

  if (state === "unsupported") {
    return (
      <p className="text-sm text-rose-700/60">
        This browser can&apos;t show notifications. On iPhone, add Whobela to your Home Screen
        first.
      </p>
    );
  }

  if (state === "unconfigured") {
    return (
      <p className="text-sm text-rose-700/60">
        Notifications aren&apos;t available yet — we&apos;ll turn them on shortly.
      </p>
    );
  }

  if (state === "denied") {
    return (
      <p className="text-sm text-rose-700/60">
        Notifications are blocked for this site. Allow them in your browser&apos;s site settings
        to get them here.
      </p>
    );
  }

  return (
    <label className="flex items-center gap-2 text-rose-800">
      <input
        type="checkbox"
        checked={state === "on"}
        disabled={busy}
        onChange={(e) => handleToggle(e.target.checked)}
      />
      Notify me on this device when someone answers
    </label>
  );
}
