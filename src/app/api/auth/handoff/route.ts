import { NextResponse } from "next/server";
import { getSession, createSessionToken, sessionCookie } from "@/lib/auth";
import { getRootOrigin } from "@/lib/config";
import { appShellCookie } from "@/lib/app-shell";

/**
 * Hands the app's session to the WebView that hosts the editor.
 *
 * The app signs in natively and holds a bearer token; the editor is the
 * existing web UI and authenticates by cookie. Without a bridge the WebView
 * loads signed-out — and because an anonymous draft lives in localStorage and
 * is only replayed into the account at signup, the effect isn't a login prompt
 * but a page someone spent ten minutes on quietly failing to save.
 *
 * The app points the WebView here with its bearer token on the initial request;
 * this sets the cookie and redirects to the real destination, so the token
 * never lands in a URL, browser history, or a Caddy access log.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = getRootOrigin();
  const target = safeRedirectPath(new URL(request.url).searchParams.get("to"));

  // Freshly minted rather than reusing the bearer token: this is the copy that
  // will sit in a cookie jar for thirty days, and it should start its life now
  // rather than inheriting whatever remained of the app's.
  const token = await createSessionToken({
    userId: session.userId,
    email: session.email,
    username: session.username,
    tokenVersion: session.tokenVersion,
  });

  const response = NextResponse.redirect(new URL(target, origin), { status: 303 });
  response.cookies.set(sessionCookie(token));
  // Marks every later navigation in this WebView as app-hosted, so the web UI
  // can drop the chrome the app already provides.
  response.cookies.set(appShellCookie);
  return response;
}

/**
 * Only same-site paths, and never a protocol-relative one.
 *
 * `//evil.example` is a valid URL that most path checks let through, and this
 * endpoint hands out a session — an open redirect here would be a way to walk
 * someone from a link they trust to a page they don't, already signed in.
 */
function safeRedirectPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  // A backslash is treated as a slash by some parsers, so `/\evil.example`
  // is the same trick wearing a different hat.
  if (raw.includes("\\")) return "/dashboard";
  return raw;
}
