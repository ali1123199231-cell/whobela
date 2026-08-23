// The Android app is published from the "Slekio" Play developer account.
// Everything about where it lives is here so the package id exists in one
// place — it is also baked into /.well-known/assetlinks.json, which must name
// the identical package.

export const PLAY_PACKAGE_ID = "com.whobela.app";

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE_ID}`;

/**
 * The link every badge on the website should use.
 *
 * Points at our own /go/play, which counts the tap and then redirects to the
 * tagged store URL below. Callers pass the surface they live on so the two
 * halves of the funnel — taps here, installs in Play's traffic-source report —
 * can be read against each other.
 */
export function playRedirect(source: "bar" | "footer" | "post_publish" | "settings"): string {
  return `/go/play?s=${source}`;
}

/**
 * The store URL tagged so Play can tell us where an install came from.
 *
 * Play forwards the `referrer` value to the Install Referrer API and reports it
 * under Acquisition → traffic source, which is the only way to answer "did the
 * website actually drive installs" — the store badge is bucketed to 0+/5+/10+
 * and tells you nothing about the source. The value has to be a single encoded
 * query string, not separate utm_* parameters, or Play drops it.
 */
export function playStoreUrl(medium: string): string {
  const referrer = new URLSearchParams({
    utm_source: "whobela.com",
    utm_medium: medium,
    utm_campaign: "web_install",
  }).toString();
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
}

/**
 * True for Android browsers, which are the only visitors who can install from
 * Play. Deliberately a userAgent sniff: there is no feature test for "the OS
 * this browser runs on", and getting it wrong only means someone is offered a
 * link they can still choose to ignore.
 */
export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}
