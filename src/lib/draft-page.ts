// A date page built before there's an account to hang it on.
//
// The app's first screen is the editor, not a login wall — someone who installs
// from Google Play can shape a real invitation and only meet the signup form
// once they want to keep it. That means the config has nowhere server-side to
// live yet, so it goes to localStorage and is replayed into the account at
// signup. Everything here is browser-only and best-effort: localStorage throws
// in Safari's private mode and when cookies are blocked entirely, and a draft
// is never worth failing a page load over.

import type {
  InviteConfig,
  YesConfig,
  NoConfig,
  ReactionConfig,
  SchedulingConfig,
  PreferenceConfig,
  ConfirmationConfig,
  ThemeKey,
} from "./date-page-defaults";

export type PageDraft = {
  theme?: ThemeKey;
  inviteConfig?: InviteConfig;
  yesConfig?: YesConfig;
  noConfig?: NoConfig;
  reactionConfig?: ReactionConfig;
  schedulingConfig?: SchedulingConfig;
  preferenceConfig?: PreferenceConfig;
  confirmationConfig?: ConfirmationConfig;
};

// Versioned: the config shapes are validated server-side by datePageUpdateSchema,
// so a draft written by an older build could fail that check forever. Bumping
// this abandons old drafts instead of replaying one that can never be accepted.
const STORAGE_KEY = "whobela:page-draft:v1";

export function readDraft(): PageDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as PageDraft;
  } catch {
    return null;
  }
}

// The draft is exposed to React through useSyncExternalStore rather than copied
// into component state, because localStorage doesn't exist during the server
// render: seeding state from it on the client's first render would contradict
// the HTML already sent, and restoring it in an effect means a setState that
// cascades an extra render (and that the lint rules reject). Subscribing lets
// the server render the empty draft and the client swap in the stored one
// through the normal store path.
//
// getSnapshot must return a referentially stable value or the subscription
// re-renders forever, so the parsed draft is cached here and only replaced when
// it actually changes.
const EMPTY: PageDraft = {};
let snapshot: PageDraft | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeToDraft(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getDraftSnapshot(): PageDraft {
  if (snapshot === null) snapshot = readDraft() ?? EMPTY;
  return snapshot;
}

/** The server has no stored draft, and this reference must never change. */
export function getServerDraftSnapshot(): PageDraft {
  return EMPTY;
}

/** Merges a patch over the stored draft and returns the result. */
export function writeDraft(patch: PageDraft): PageDraft {
  const next = { ...getDraftSnapshot(), ...patch };
  snapshot = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked. The draft still lives in the snapshot for this
      // session, which is the part the person can actually see.
    }
  }
  emit();
  return next;
}

export function clearDraft(): void {
  snapshot = EMPTY;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to do — a draft we can't remove is one we also couldn't write.
    }
  }
  emit();
}

/**
 * Replays a draft into the signed-in account's date page.
 *
 * Only safe to call immediately after *signup*, where the page was created
 * empty moments ago. Deliberately not wired into login: a returning user can
 * have both a published page and a stale draft from an idle browse, and this
 * would silently overwrite the real one.
 *
 * The draft is cleared whether or not the write succeeds. A draft that the
 * server rejects is unreplayable by definition, and keeping it would re-fail on
 * every future signup from this browser.
 *
 * Returns whether there was a draft to replay, so the caller can send someone
 * who built a page to that page, and everyone else wherever they normally go.
 */
export async function applyDraftToAccount(): Promise<boolean> {
  const draft = readDraft();
  if (!draft || Object.keys(draft).length === 0) return false;

  try {
    await fetch("/api/page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
  } catch {
    // Offline or the request died. The account still exists and has a default
    // page, so send them onward rather than stranding them on the form.
  } finally {
    clearDraft();
  }
  return true;
}
