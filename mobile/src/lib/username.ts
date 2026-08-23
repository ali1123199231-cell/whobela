import { apiFetch } from "./api";

export type UsernameCheck = { available: boolean; suggestions: string[] };

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
