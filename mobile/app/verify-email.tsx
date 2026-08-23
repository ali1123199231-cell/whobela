import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button, Field, Banner } from "@/components/ui";
import { log } from "@/lib/log";
import { colors, spacing, type } from "@/lib/theme";

/**
 * Enter the code emailed at signup.
 *
 * Until this existed the app had no verification UI at all: signup dropped
 * straight into the tabs, the code arrived in an inbox, and there was nowhere
 * in the app to type it — the only route was to go and find the website.
 *
 * This is a wall: the tabs layout redirects any unverified account here, so
 * there is no way into the app without a working address. That is only
 * defensible because of the doors below it. A wall with a code box and nothing
 * else turns one mistyped character at signup into an account that can never
 * be verified, whose address can never be changed, and which cannot even be
 * deleted — so changing the address, signing out and deleting all stay
 * reachable from here. Deletion in particular has to: Play expects an app that
 * creates accounts to let people delete them, and this screen would otherwise
 * be in front of that.
 */
export default function VerifyEmailScreen() {
  const { user, refresh, signOut } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  const enterTheApp = () => router.replace("/(tabs)/inbox");

  const verify = async () => {
    const entered = code.trim();
    if (entered.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await apiFetch("/api/auth/verify-email", { method: "POST", body: { code: entered } });
      log.info("verify.ok");
      // Pull the fresh emailVerified through before leaving, so the banner on
      // the inbox is already gone when they land on it.
      await refresh();
      enterTheApp();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      await apiFetch("/api/auth/resend-verification", { method: "POST" });
      setNotice("Sent. Check your email — it can take a minute.");
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>
          We sent a code to {user?.email ?? "your email"}. Enter it below to confirm the
          address is yours.
        </Text>

        {!!error && <Banner message={error} />}
        {!!notice && <Banner tone="info" message={notice} />}

        {/* Six digits — verifyEmailSchema is /^\d{6}$/ — so the number pad
            comes up rather than the full keyboard, and anything pasted in gets
            stripped to digits instead of failing validation for a stray space. */}
        <Field
          label="Verification code"
          value={code}
          onChangeText={(text) => setCode(text.replace(/\D/g, "").slice(0, 6))}
          autoCorrect={false}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={6}
          placeholder="123456"
        />

        <Button label="Verify" onPress={() => void verify()} loading={busy} />
        <Button
          label={resending ? "Sending..." : "Send a new code"}
          variant="secondary"
          onPress={() => void resend()}
          loading={resending}
        />

        {/* The doors. Without these the wall is a trap: a typo'd address cannot
            be verified, cannot be changed, and cannot be released by deleting
            the account either. */}
        <Text style={styles.link} onPress={() => router.push("/change-email")}>
          Wrong address? Change it
        </Text>
        <Text style={styles.link} onPress={() => void signOut()}>
          Sign out
        </Text>
        <Text style={[styles.link, styles.destructive]} onPress={() => router.push("/delete-account")}>
          Delete my account
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: { padding: spacing.md, gap: spacing.sm },
  subtitle: { ...type.small, marginBottom: spacing.xs },
  link: {
    ...type.small,
    color: colors.rose600,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: spacing.sm,
  },
  destructive: { color: colors.danger },
});
