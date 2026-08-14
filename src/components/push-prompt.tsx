"use client";

import { useEffect, useState } from "react";
import { canAskForPush, enablePush } from "@/lib/pwa";

/*
 * Asks for notification permission at a moment when the answer is obviously
 * yes, rather than from a checkbox in Settings that nobody scrolls to.
 *
 * The browser gives us exactly one good shot at this: a dismissed prompt puts
 * the origin into `denied`, which is sticky and can only be undone from the
 * browser's own site settings — not from anything we render. So the rules here
 * are deliberately conservative. We ask only where the value is already
 * obvious, we never ask on a bare page load, and we stop asking for good after
 * two refusals.
 */

const ASK_RECORD_KEY = "whobela.push-ask";
const MAX_ASKS = 2;
const QUIET_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

type AskRecord = { dismissals: number; lastDismissedAt: number };

// localStorage throws outright in some privacy modes, and a notification
// prompt is not worth taking the page down over.
function readAskRecord(): AskRecord {
  try {
    const raw = window.localStorage.getItem(ASK_RECORD_KEY);
    if (!raw) return { dismissals: 0, lastDismissedAt: 0 };
    const parsed = JSON.parse(raw) as Partial<AskRecord>;
    return {
      dismissals: typeof parsed.dismissals === "number" ? parsed.dismissals : 0,
      lastDismissedAt: typeof parsed.lastDismissedAt === "number" ? parsed.lastDismissedAt : 0,
    };
  } catch {
    return { dismissals: 0, lastDismissedAt: 0 };
  }
}

function recordDismissal() {
  try {
    const previous = readAskRecord();
    window.localStorage.setItem(
      ASK_RECORD_KEY,
      JSON.stringify({ dismissals: previous.dismissals + 1, lastDismissedAt: Date.now() })
    );
  } catch {
    // Not remembering the refusal is survivable; MAX_ASKS still caps us within
    // the session, and the placements themselves are rare events.
  }
}

function withinQuietPeriod(record: AskRecord): boolean {
  return record.lastDismissedAt > 0 && Date.now() - record.lastDismissedAt < QUIET_PERIOD_MS;
}

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
      if (!vapidPublicKey) return; // stays "checking", which renders nothing
      const record = readAskRecord();
      if (record.dismissals >= MAX_ASKS || withinQuietPeriod(record)) return;
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
