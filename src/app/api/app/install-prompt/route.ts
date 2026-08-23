import { NextResponse } from "next/server";
import { isFeatureEnabled, CONFIG_KEYS } from "@/lib/config";
import { isAppShell } from "@/lib/app-shell";

/**
 * Whether the marketing pages should offer the Android app right now.
 *
 * This exists as an endpoint rather than a prop because the pages that carry
 * the bar are the SEO pages, and they are statically generated with
 * `revalidate = 86400`. Reading system_config — or the app-shell cookie —
 * during their render would opt every one of them out of ISR and turn the
 * whole marketing site dynamic, which is a far worse trade than one small
 * request made after hydration.
 *
 * Cached privately, not publicly: the answer depends on a cookie, so a shared
 * cache would hand one visitor's answer to everyone behind the same proxy.
 */
export async function GET() {
  // Someone reading this page inside the app's own WebView already has the
  // app. Offering to install it is the one place this prompt looks broken.
  const inApp = await isAppShell();
  const enabled = !inApp && (await isFeatureEnabled(CONFIG_KEYS.APP_INSTALL_BAR_ENABLED));

  return NextResponse.json(
    { enabled },
    { headers: { "Cache-Control": "private, max-age=300" } }
  );
}
