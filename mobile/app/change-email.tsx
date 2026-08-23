import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button, Field, Banner } from "@/components/ui";
import { emailProblem } from "@/lib/validation";
import { log } from "@/lib/log";
import { colors, spacing, type } from "@/lib/theme";

/**
 * Corrects the address the verification code was sent to.
 *
 * This is the door in the verification wall, and the reason the wall is safe
 * to have at all: without it, one mistyped character at signup would leave an
 * account that can never be verified, whose email can never be changed, and
 * whose address cannot be reused to make another — recoverable only by writing
 * to support. The endpoint already existed for the website; the app simply had
 * no way to reach it.
 */
export default function ChangeEmailScreen() {
  const { user, refresh } = useAuth();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = emailProblem(email);
    setFieldError(problem);
    if (problem) return;
    if (!password) {
      setError("Enter your password to confirm the change.");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      await apiFetch("/api/settings/email", {
        method: "PUT",
        body: { currentPassword: password, newEmail: email.trim() },
      });
      log.info("email.changed");
      // The server clears emailVerifiedAt and sends a code to the new address,
      // so pull the new address through before going back — otherwise the wall
      // still names the old one.
      await refresh();
      router.replace("/verify-email");
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>
          We&apos;ll send a new code to the address you enter here. Your current address is{" "}
          {user?.email ?? "unknown"}.
        </Text>

        {!!error && <Banner message={error} />}

        <Field
          label="New email address"
          value={email}
          onChangeText={setEmail}
          error={fieldError}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <Field
          label="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
        />

        <Button label="Send a code to this address" onPress={() => void submit()} loading={busy} />
        <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: { padding: spacing.md, gap: spacing.sm },
  subtitle: { ...type.small, marginBottom: spacing.xs },
});
