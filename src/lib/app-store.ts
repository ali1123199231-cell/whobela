// The Android app is a Trusted Web Activity wrapping this same site, published
// from the "Slekio" Play developer account. Everything about where it lives is
// here so the package id exists in one place — it is also baked into
// /.well-known/assetlinks.json, which must name the identical package.

export const PLAY_PACKAGE_ID = "com.whobela.app";

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE_ID}`;

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
