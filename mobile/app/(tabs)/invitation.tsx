import { SiteWebView } from "@/components/site-web-view";

/**
 * The editor, signed in.
 *
 * Loads /dashboard/page through the handoff endpoint, which sets the session
 * cookie the web UI expects and marks the WebView as app-hosted so the site
 * drops its own bottom navigation — otherwise it would sit directly above the
 * app's tab bar.
 */
export default function InvitationScreen() {
  return <SiteWebView path="/dashboard/page" />;
}
