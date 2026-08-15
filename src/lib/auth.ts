import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "whobela_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

// The Android app has no cookie jar we control, so it holds the same JWT and
// sends it as a bearer token instead. It announces itself with this header on
// login and signup, which is the only way to get the token back in the response
// body — the browser must never see it, since an httpOnly cookie is exactly
// what keeps page JavaScript away from a 30-day credential.
const CLIENT_HEADER = "x-whobela-client";

/** True when the caller is the native app rather than a browser. */
export function isNativeClient(request: Request) {
  return request.headers.get(CLIENT_HEADER) !== null;
}

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  tokenVersion: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

/**
 * The session cookie as a plain object, for handlers that build their own
 * response — a redirect can't go through `cookies()`, since that mutates the
 * response Next is about to generate rather than the one being returned.
 */
export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const { name, value, ...options } = sessionCookie(token);
  cookieStore.set(name, value, options);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? (await getBearerToken());
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * The `Authorization: Bearer` fallback for the native app. Checked only after
 * the cookie, so a browser session always wins and nothing about the web flow
 * changes.
 */
async function getBearerToken(): Promise<string | null> {
  const header = (await headers()).get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  return header.slice("bearer ".length).trim() || null;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  let payload: SessionPayload;
  try {
    const verified = await jwtVerify(token, getSecret());
    payload = verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }

  // Reject tokens signed under an older tokenVersion — bumped on password
  // change/reset so every other outstanding session is invalidated at once,
  // since the JWT itself is otherwise stateless and never checked again.
  const current = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { tokenVersion: true },
  });
  if (!current || current.tokenVersion !== payload.tokenVersion) return null;

  return payload;
}
