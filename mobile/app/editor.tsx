import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SiteWebView } from "@/components/site-web-view";
import { Button } from "@/components/ui";
import { colors, spacing, type } from "@/lib/theme";

/**
 * The signed-out first screen: a real editor, not a login wall.
 *
 * The draft lives in the WebView's own storage until someone signs up, at which
 * point the web app replays it into the new account. That is why the sign-up
 * button here goes through the app's native screens rather than the site's —
 * the account has to exist before the draft has anywhere to land.
 */
export default function EditorScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.web}>
        <SiteWebView path="/create?source=app" requiresAuth={false} />
      </View>
      <View style={styles.bar}>
        <Text style={styles.barText}>Sign up to keep this and see who answers.</Text>
        <View style={styles.barButtons}>
          <View style={styles.barButton}>
            <Button label="Sign in" variant="secondary" onPress={() => router.push("/login")} />
          </View>
          <View style={styles.barButton}>
            <Button label="Create account" onPress={() => router.push("/signup")} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  web: { flex: 1 },
  bar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: spacing.sm,
  },
  barText: { ...type.small, textAlign: "center" },
  barButtons: { flexDirection: "row", gap: spacing.sm },
  barButton: { flex: 1 },
});
