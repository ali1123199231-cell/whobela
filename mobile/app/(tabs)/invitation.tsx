import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SiteWebView } from "@/components/site-web-view";
import { PushPrompt } from "@/components/push-prompt";
import { spacing } from "@/lib/theme";

/**
 * The editor, signed in.
 *
 * Loads /dashboard/page through the handoff endpoint, which sets the session
 * cookie the web UI expects and marks the WebView as app-hosted so the site
 * drops its own bottom navigation — otherwise it would sit directly above the
 * app's tab bar.
 *
 * Publishing is the moment worth asking about notifications: the page is live,
 * the link is about to go out, and the only thing left is waiting for an
 * answer. The website cannot ask here — a WebView has no Notification API, so
 * a web prompt could only report that it does not work — which is why it posts
 * the moment across the bridge for the native dialog to handle.
 */
export default function InvitationScreen() {
  const [justPublished, setJustPublished] = useState(false);

  return (
    <View style={styles.container}>
      <SiteWebView path="/dashboard/page" onPublished={() => setJustPublished(true)} />
      {justPublished && (
        // Over the editor rather than inside it: the WebView owns its whole
        // area, and the card has to sit above the page that triggered it.
        <View style={styles.prompt} pointerEvents="box-none">
          <PushPrompt onDone={() => setJustPublished(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  prompt: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
});
