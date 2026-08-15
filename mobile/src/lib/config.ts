import Constants from "expo-constants";
import * as Application from "expo-application";

/**
 * Where the API lives.
 *
 * In a release build this is always whobela.com. In development it cannot be
 * localhost — that resolves to the phone itself, not the laptop running Next —
 * so the LAN address is taken from the Metro connection the app is already
 * talking to. It is the one host guaranteed to be reachable from this device,
 * and it means no hardcoded IP to update whenever the network changes.
 */
function resolveApiBase(): string {
  if (!__DEV__) return "https://whobela.com";

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(":")[0];
  if (host) return `http://${host}:3000`;

  // Android emulators reach the host machine through this alias.
  return "http://10.0.2.2:3000";
}

export const API_BASE = resolveApiBase();

/**
 * Identifies the app to the API. Its presence is what makes login and signup
 * hand back a token instead of relying on a cookie, and the version lets the
 * server tell one release's failures from another's.
 */
export const CLIENT_HEADER = "x-whobela-client";

export const APP_VERSION = Application.nativeApplicationVersion ?? "0.0.0";

/**
 * The integer Play compares between releases, and what the update gate checks.
 * Read from the built app rather than app.json so it can never disagree with
 * what was actually installed.
 */
export const VERSION_CODE = Number(Application.nativeBuildVersion ?? "0") || 0;

export const CLIENT_ID = `android/${APP_VERSION}(${VERSION_CODE})`;

export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.whobela.app";

/**
 * The link someone actually sends.
 *
 * In production every page is served from its own subdomain, which is what the
 * dashboard shows and what recipients see. Development has no wildcard DNS, so
 * the site falls back to a preview path there — mirrored here so the share
 * sheet hands out a link that works on whichever one the app is pointed at.
 */
export function invitationUrl(username: string): string {
  if (__DEV__) return `${API_BASE}/preview/${username}`;
  return `https://${username}.whobela.com`;
}
