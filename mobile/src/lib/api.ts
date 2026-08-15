import * as SecureStore from "expo-secure-store";
import { API_BASE, CLIENT_HEADER, CLIENT_ID } from "./config";

const TOKEN_KEY = "whobela.session";

/**
 * The session token, in the keystore rather than AsyncStorage.
 *
 * It is a thirty-day credential to someone's account and inbox. SecureStore
 * puts it behind Android's Keymaster, so it is not readable from a backup or by
 * anything that gets filesystem access to the app's sandbox.
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Raised when the stored token is no longer good — the password was changed on
 * another device, or the account is gone. Separated from other errors so the
 * app can sign out rather than showing "something went wrong" to someone who
 * simply needs to sign in again.
 */
export class SessionExpiredError extends ApiError {
  constructor() {
    super(401, "Your session ended. Sign in again.");
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Skips the token — used by login, signup and the version check. */
  anonymous?: boolean;
  signal?: AbortSignal;
};

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const { method = "GET", body, anonymous = false, signal } = options;

  const headers: Record<string, string> = { [CLIENT_HEADER]: CLIENT_ID };
  if (body !== undefined) headers["content-type"] = "application/json";

  if (!anonymous) {
    const token = await getToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // fetch only rejects on transport failure, so this is genuinely "no
    // network" rather than an error the server chose to send.
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError(0, "No connection. Check your signal and try again.");
  }

  if (res.status === 401 && !anonymous) {
    throw new SessionExpiredError();
  }

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (payload as { error?: string } | null)?.error ?? "Something went wrong. Try again.";
    throw new ApiError(res.status, message);
  }

  return payload as T;
}

/**
 * Multipart upload, which cannot go through apiFetch: setting a content-type
 * by hand strips the boundary React Native generates, and the request arrives
 * unparseable at the other end.
 */
export async function apiUpload<T>(
  path: string,
  file: { uri: string; name: string; type: string },
  fields: Record<string, string> = {}
): Promise<T> {
  const form = new FormData();
  // React Native's FormData takes this shape rather than a Blob.
  form.append("file", file as unknown as Blob);
  for (const [key, value] of Object.entries(fields)) form.append(key, value);

  const token = await getToken();
  const headers: Record<string, string> = { [CLIENT_HEADER]: CLIENT_ID };
  if (token) headers.authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { method: "POST", headers, body: form });
  if (res.status === 401) throw new SessionExpiredError();

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, (payload as { error?: string } | null)?.error ?? "Upload failed.");
  }
  return payload as T;
}
