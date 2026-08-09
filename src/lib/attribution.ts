// First-touch acquisition attribution.
//
// We capture the referrer + UTM params + gclid the *first* time a visitor lands
// on the site, stash it in localStorage, and never overwrite it. Whenever they
// eventually sign up (possibly several client-side navigations later, after the
// URL query params are long gone), the signup form reads it back and sends it
// along so we can persist it on the User row.

const STORAGE_KEY = "whobela_attribution";

export type Attribution = {
  signupReferrer?: string;
  signupLandingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
};

function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  // Keep payloads sane; the DB columns are unbounded but we don't need essays.
  return trimmed.slice(0, 500);
}

// Whether a record names *where the visitor came from*, as opposed to merely
// recording that they showed up. A bare direct visit has a landing path and
// nothing else.
function hasAcquisitionSignal(data: Attribution): boolean {
  return !!(
    data.utmSource ||
    data.utmMedium ||
    data.utmCampaign ||
    data.gclid ||
    data.signupReferrer
  );
}

function readCurrentVisit(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  const internalReferrer =
    !!referrer && new URL(referrer).host === window.location.host;

  return {
    signupReferrer: internalReferrer ? undefined : clean(referrer),
    signupLandingPath: clean(window.location.pathname + window.location.search),
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
    utmTerm: clean(params.get("utm_term")),
    utmContent: clean(params.get("utm_content")),
    gclid: clean(params.get("gclid")),
  };
}

// Records first-touch attribution. Safe to call on every page load.
//
// Direct visits are stored too, even though they carry no acquisition signal —
// otherwise "arrived by typing the URL" and "attribution never ran" are the same
// row of nulls, and we can't tell dark-social traffic from a tracking failure.
// The cost is that a stored direct visit would otherwise shadow a later ad click,
// so a signal-bearing visit is allowed to upgrade a signal-less record. The
// landing path stays pinned to the genuine first touch.
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const stored = readAttribution();
    const isStored = Object.keys(stored).length > 0;
    if (isStored && hasAcquisitionSignal(stored)) return;

    const current = readCurrentVisit();
    if (isStored && !hasAcquisitionSignal(current)) return;

    const next: Attribution = isStored
      ? { ...current, signupLandingPath: stored.signupLandingPath ?? current.signupLandingPath }
      : current;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage can throw (private mode, disabled). Attribution is
    // best-effort — never let it break the page.
  }
}

// Reads back the stored first-touch attribution for inclusion in the signup
// request. Returns an empty object when nothing was captured.
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
