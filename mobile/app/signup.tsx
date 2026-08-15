import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { Button, Field, Banner } from "@/components/ui";
import { colors, spacing, type } from "@/lib/theme";
import {
  emailProblem,
  passwordProblem,
  usernameProblem,
  firstNameProblem,
  PASSWORD_HINT,
} from "@/lib/validation";

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problems = {
      firstName: firstNameProblem(firstName),
      username: usernameProblem(username.trim().toLowerCase()),
      email: emailProblem(email),
      password: passwordProblem(password),
    };
    setFieldErrors(problems);
    if (Object.values(problems).some(Boolean)) return;

    setError(null);
    setBusy(true);
    try {
      await signUp({
        firstName: firstName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        password,
      });
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Your invitation is saved as soon as you do, and answers arrive here.
        </Text>

        {!!error && <Banner message={error} />}

        <Field
          label="Your first name"
          value={firstName}
          onChangeText={setFirstName}
          error={fieldErrors.firstName}
          autoComplete="given-name"
          placeholder="Alex"
        />
        <Field
          label="Username"
          value={username}
          onChangeText={setUsername}
          error={fieldErrors.username}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="alex"
        />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
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
          error={fieldErrors.password ?? undefined}
          secureTextEntry
          autoComplete="new-password"
          placeholder={PASSWORD_HINT}
        />

        <Button label="Create account" onPress={submit} loading={busy} />
        <Button label="I already have an account" variant="quiet" onPress={() => router.replace("/login")} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: { padding: spacing.lg, gap: spacing.md },
  title: type.title,
  subtitle: { ...type.small, marginBottom: spacing.sm },
});
