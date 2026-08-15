import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { Button, Field, Banner } from "@/components/ui";
import { colors, spacing, type } from "@/lib/theme";
import { API_BASE } from "@/lib/config";
import { emailProblem } from "@/lib/validation";
import { Linking } from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = emailProblem(email);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)/inbox");
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
        <Text style={styles.title}>Welcome back</Text>

        {!!error && <Banner message={error} />}

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          inputMode="email"
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          onSubmitEditing={submit}
          returnKeyType="go"
        />

        <Button label="Sign in" onPress={submit} loading={busy} disabled={!email || !password} />

        <View style={styles.links}>
          <Button
            label="Forgot your password?"
            variant="quiet"
            onPress={() => void Linking.openURL(`${API_BASE}/forgot-password`)}
          />
          <Button
            label="Create an account"
            variant="quiet"
            onPress={() => router.replace("/signup")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { ...type.title, marginBottom: spacing.sm },
  links: { marginTop: spacing.sm, gap: spacing.xs },
});
