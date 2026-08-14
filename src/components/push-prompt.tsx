"use client";

import { useEffect, useState } from "react";
import { canAskForPush, enablePush, ensureSubscriptionSynced } from "@/lib/pwa";
import { askingIsAllowed, recordDismissal } from "@/lib/push-ask-record";

/*
 * Asks for notification permission at a moment when the answer is obviously
 * yes, rather than from a checkbox in Settings that nobody scrolls to.
 *
 * We ask only where the value is already obvious, never on a bare page load,
 * and only while the local refusal history still allows it — see
 * lib/push-ask-record for why that budget exists and how it's spent.
 */

type Placement = "publish" | "inbox";

const COPY: Record<Placement, { title: string; body: string; cta: string }> = {
  publish: {
    title: "Your page is live 🎉",
    body: "Want to know the moment someone says yes? We'll send a notification straight to this device.",
    cta: "Notify me",
  },
  inbox: {
    title: "Don't miss the next one",
    body: "Get a notification on this device the moment someone says yes — no need to keep checking here.",
    cta: "Turn on notifications",
  },
};

type State = "checking" | "ready" | "busy" | "enabled" | "failed" | "hidden";

export function PushPrompt({
  placement,
  vapidPublicKey,
  onDismiss,
}: {
  placement: Placement;
  /** Null when web push isn't configured on the server — nothing to ask for. */
  vapidPublicKey: string | null;
  /** Modal placements use this to unmount; inline ones can leave it off. */
  onDismiss?: () => void;
}) {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Unconditional, and before any of the early returns: someone already
      // subscribed is exactly who we never ask, so this is the only place their
      // drifted subscription would get noticed. No-ops when there isn't one.
      await ensureSubscriptionSynced();

      if (!vapidPublicKey) return; // stays "checking", which renders nothing
      if (!askingIsAllowed()) return;
      const askable = await canAskForPush();
      if (!cancelled && askable) setState("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [vapidPublicKey]);

  async function handleEnable() {
    setState("busy");
    const result = await enablePush(vapidPublicKey);
    if (result === "enabled") {
      setState("enabled");
      return;
    }
    // A refusal at the browser's own prompt counts against the budget just as a
    // dismissal of ours does — it's the same answer, given one dialog later.
    if (result === "denied") recordDismissal();
    setState("failed");
  }

  function handleDismiss() {
    recordDismissal();
    setState("hidden");
    onDismiss?.();
  }

  if (state === "checking" || state === "hidden") return null;

  const copy = COPY[placement];
  const isModal = placement === "publish";

  const content =
    state === "enabled" ? (
      <>
        <p className="font-semibold text-rose-950">You&apos;re all set ✅</p>
        <p className="mt-1 text-sm text-rose-700/80">
          We&apos;ll notify you on this device the moment someone answers.
        </p>
        <button
          onClick={() => {
            setState("hidden");
            onDismiss?.();
          }}
          className="mt-4 w-fit rounded-full bg-rose-500 px-4 py-1.5 text-sm font-semibold text-white"
        >
          Done
        </button>
      </>
    ) : state === "failed" ? (
      <>
        <p className="font-semibold text-rose-950">Notifications didn&apos;t turn on</p>
        <p className="mt-1 text-sm text-rose-700/80">
          No problem — we&apos;ll still email you every time someone says yes.
        </p>
        <button
          onClick={() => {
            setState("hidden");
            onDismiss?.();
          }}
          className="mt-4 w-fit rounded-full bg-rose-500 px-4 py-1.5 text-sm font-semibold text-white"
        >
          Got it
        </button>
      </>
    ) : (
      <>
        <p className="font-semibold text-rose-950">{copy.title}</p>
        <p className="mt-1 text-sm text-rose-700/80">{copy.body}</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleEnable}
            disabled={state === "busy"}
            className="rounded-full bg-rose-500 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {state === "busy" ? "Turning on..." : copy.cta}
          </button>
          <button onClick={handleDismiss} className="text-sm text-rose-400">
            Not now
          </button>
        </div>
      </>
    );

  if (isModal) {
    // z-50 matches the other overlays (photo cropper/manager). It's rendered
    // after the sticky header, so it sits above it at the same level.
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-rose-950/40 p-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg shadow-rose-200">{content}</div>
      </div>
    );
  }

  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">{content}</div>;
}
