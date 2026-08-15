import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Linking, StyleSheet, View } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useFocusEffect } from "expo-router";
import { API_BASE, CLIENT_HEADER, CLIENT_ID } from "@/lib/config";
import { getToken } from "@/lib/api";
import { colors } from "@/lib/theme";
import { ScreenMessage } from "./ui";
import { log } from "@/lib/log";

/**
 * Hosts the invitation editor, which is the existing web UI.
 *
 * Not a compromise: the editor is the screen people spend longest in and the
 * one that changes most, and keeping it on the web means those changes reach
 * every install immediately instead of waiting on a Play review. The palette is
 * shared with the native screens precisely so this seam is invisible.
 */
export function SiteWebView({ path }: { path: string }) {
  const webRef = useRef<WebView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const canGoBack = useRef(false);

  const build = useCallback(async () => {
    // Read unconditionally, so every path through this function reaches its
    // state updates after an await rather than during the mount render.
    const token = await getToken();
    const base = { [CLIENT_HEADER]: CLIENT_ID };

    // Always through the handoff, signed in or not. A WebView keeps its own
    // cookie jar, so loading the site directly can show a session the app knows
    // nothing about: someone signed out of the app was still signed in to the
    // website inside it, as a different account, with the website's own
    // navigation showing under the app's. The handoff sets the cookie when
    // there is a token and clears it when there isn't, which makes the app's
    // state the one that counts — and sets the marker that hides the web nav.
    log.info("webview.handoff", { path, hasToken: !!token });
    setUri(`${API_BASE}/api/auth/handoff?to=${encodeURIComponent(path)}`);
    setHeaders(token ? { ...base, authorization: `Bearer ${token}` } : base);
  }, [path]);

  useEffect(() => {
    // build is async and every setState in it runs after an await, so no
    // cascading render happens; the rule flags the call site without
    // tracking that.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void build();
  }, [build]);

  // Android's back gesture should walk back through the editor's own steps
  // before it leaves the screen, which is what someone expects from a back
  // button that has been moving them between questions.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (canGoBack.current) {
          webRef.current?.goBack();
          return true;
        }
        return false;
      });
      return () => subscription.remove();
    }, [])
  );

  /**
   * Keeps the WebView on our own site.
   *
   * A tap on Instagram, a privacy policy, or a payment provider should open in
   * the real browser: those pages are not part of the app, they have no way
   * back, and some of them refuse to load in a WebView at all.
   */
  const onShouldStart = useCallback((event: WebViewNavigation) => {
    const isOurs = event.url.startsWith(API_BASE);
    log.debug("webview.navigate", { url: event.url.slice(0, 120), external: !isOurs });
    if (isOurs) return true;
    void Linking.openURL(event.url);
    return false;
  }, []);

  if (failed) {
    return (
      <ScreenMessage
        title="Couldn't load the editor"
        body="Check your connection and try again."
        action={{
          label: "Try again",
          onPress: () => {
            // Cleared here rather than inside build, so the effect that calls
            // build on mount doesn't set state synchronously and cost a render.
            setFailed(false);
            setLoading(true);
            void build();
          },
        }}
      />
    );
  }

  if (!uri) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.rose600} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ uri, headers }}
        // Without this the localStorage draft — which is how an invitation
        // built before signing up survives to be claimed at signup — silently
        // fails to persist.
        domStorageEnabled
        javaScriptEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        // Photos are chosen through the site's own file input inside the
        // editor, so the WebView must be allowed to open the picker.
        allowFileAccess
        originWhitelist={["https://*", "http://*"]}
        onShouldStartLoadWithRequest={onShouldStart}
        onNavigationStateChange={(state) => {
          canGoBack.current = state.canGoBack;
        }}
        onLoadEnd={() => {
          log.info("webview.loaded", { path });
          setLoading(false);
        }}
        onError={({ nativeEvent }) => {
          log.error("webview.error", { path, description: nativeEvent.description });
          setLoading(false);
          setFailed(true);
        }}
        onHttpError={({ nativeEvent }) => {
          // A 401 here means the handoff was refused; anything 500 and up is
          // the server failing. Both are worth showing rather than a blank page.
          log.warn("webview.httpError", { path, status: nativeEvent.statusCode });
          if (nativeEvent.statusCode >= 500 || nativeEvent.statusCode === 401) setFailed(true);
        }}
        style={styles.web}
      />
      {loading && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator color={colors.rose600} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  web: { flex: 1, backgroundColor: colors.rose50 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.rose50 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.rose50,
  },
});
