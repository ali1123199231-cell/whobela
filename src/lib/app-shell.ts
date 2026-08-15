import { cookies } from "next/headers";

/**
 * Whether this request is being rendered inside the native app's WebView.
 *
 * The app wraps the editor in its own navigation, so the web's bottom bar would
 * sit directly above the app's tab bar — two rows of navigation, disagreeing
 * about which tab is current. Rather than a query parameter, which the first
 * in-page link would drop, the handoff endpoint sets a cookie when it hands the
 * session over, so every subsequent navigation inside that WebView still knows.
 */
const APP_SHELL_COOKIE = "whobela_app";

export const appShellCookie = {
  name: APP_SHELL_COOKIE,
  value: "1",
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  // Matches the session it is handed out alongside.
  maxAge: 60 * 60 * 24 * 30,
};

export async function isAppShell(): Promise<boolean> {
  const store = await cookies();
  return store.get(APP_SHELL_COOKIE)?.value === "1";
}
