import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { clearCache } from "@/lib/inbox";
import { Button, Field, Banner } from "@/components/ui";
import { log } from "@/lib/log";
import { colors, spacing, type } from "@/lib/theme";

/**
 * Deletes the account, from inside the app.
 *
 * Settings used to open whobela.com/delete-account in the phone's browser,
 * which is a page explaining that you should go to your account settings and
 * choose Delete Account — advice you were already following, describing a
 * control the app did not have. The browser was not signed in either, so there
 * was in practice no way to delete an account from the app at all. Play
 * expects an app that can create an account to be able to delete one.
 *
 * The typed-username confirmation is not decoration: the API refuses the
 * request unless it matches exactly, so this collects what the server already
 * demands rather than inventing a softer gesture the backend would reject.
 */
export default function DeleteAccountScreen() {
  const { user, signOut } = useAuth();
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const username = user?.username ?? "";
  const matches = confirmation.trim().toLowerCase() === username.toLowerCase() && !!username;

  const destroy = async () => {
    setError(null);
    setBusy(true);
    try {
      await apiFetch("/api/settings/account", {
        method: "DELETE",
        body: { usernameConfirmation: confirmation.trim().toLowerCase() },
      });
      log.info("account.deleted");
      // The cached inbox belongs to an account that no longer exists; leaving
      // it on the device would show a deleted person's answers on the sign-in
      // screen of whoever opens the app next.
      await clearCache();
      await signOut();
      router.replace("/editor");
    } catch (failure) {
      setError((failure as Error).message);
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.lead}>This cannot be undone.</Text>
        <Text style={styles.body}>
          Deleting your account removes your invitation page, your photos, and every answer
          anyone has sent you. Your link stops working immediately.
        </Text>

        {!!error && <Banner message={error} />}

        <Field
          label={`Type ${username} to confirm`}
          value={confirmation}
          onChangeText={setConfirmation}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={username}
        />

        <Button
          label="Delete my account"
          variant="danger"
          onPress={() => void destroy()}
          loading={busy}
          disabled={!matches}
        />
        <Button label="Keep my account" variant="secondary" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: { padding: spacing.md, gap: spacing.sm },
  lead: { ...type.heading, fontSize: 18, color: colors.danger },
  body: { ...type.small, marginBottom: spacing.xs },
});
