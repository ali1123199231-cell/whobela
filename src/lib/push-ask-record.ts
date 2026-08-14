/*
 * How often we're still allowed to ask this browser for notification
 * permission, remembered locally per device.
 *
 * The browser gives us one good shot: a dismissed prompt puts the origin into
 * `denied`, which is sticky and can only be undone from the browser's own site
 * settings — nothing we render can reverse it. So refusals are counted and
 * respected rather than forgotten between visits.
 *
 * Lives apart from the components so that Settings, which has no prompt of its
 * own, can still record a refusal made through its toggle.
 */

const ASK_RECORD_KEY = "whobela.push-ask";
const MAX_ASKS = 2;
const QUIET_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

type AskRecord = { dismissals: number; lastDismissedAt: number };

// localStorage throws outright in some privacy modes, and a notification
// prompt is not worth taking the page down over.
function read(): AskRecord {
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

function write(record: AskRecord) {
  try {
    window.localStorage.setItem(ASK_RECORD_KEY, JSON.stringify(record));
  } catch {
    // Not remembering the refusal is survivable: the in-memory state still
    // hides the prompt for this visit, and the placements are rare events.
  }
}

/** A refusal — of our prompt, or of the browser's own dialog. */
export function recordDismissal() {
  write({ dismissals: read().dismissals + 1, lastDismissedAt: Date.now() });
}

/**
 * Stop asking entirely. Used when someone turns notifications *off* from
 * Settings: they know the feature exists, they found the switch and they chose
 * against it. Asking again after that is nagging, not helping — and the switch
 * is right there whenever they change their mind.
 */
export function silencePrompt() {
  write({ dismissals: MAX_ASKS, lastDismissedAt: Date.now() });
}

/** Whether the local refusal history still leaves room for an ask. */
export function askingIsAllowed(): boolean {
  const record = read();
  if (record.dismissals >= MAX_ASKS) return false;
  return !(record.lastDismissedAt > 0 && Date.now() - record.lastDismissedAt < QUIET_PERIOD_MS);
}
