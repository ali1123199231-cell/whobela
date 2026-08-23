import { apiFetch } from "./api";

export type UsernameCheck = { available: boolean; suggestions: string[] };

/**
 * A username derived from what someone typed as their first name.
 *
 * The same rule the website uses, so "Alex" offers `alex` on both. Nobody
 * arrives wanting to invent a handle — they want their page to exist — so the
 * field starts filled in and the availability check runs against it
 * immediately, rather than sitting empty until they think of something.
 *
 * Returns "" for anything too short to be legal; the caller shows an empty
 * field rather than a suggestion that cannot be used.
 */
export function usernameFromName(firstName: string): string {
  const base = firstName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return base.length >= 3 ? base : "";
}

/**
 * Asks the server whether a username is free, and what is, if it isn't.
 *
 * Anonymous: this runs on the signup screen, before there is a token. The
 * candidate list is built server-side so the reserved names — `connect` above
 * all, which every custom domain points at — cannot drift out of a copy kept
 * here.
 */
export function checkUsername(base: string, signal?: AbortSignal): Promise<UsernameCheck> {
  return apiFetch<UsernameCheck>(
    `/api/auth/suggest-username?base=${encodeURIComponent(base)}`,
    { anonymous: true, signal }
  );
}
