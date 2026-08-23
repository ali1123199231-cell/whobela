import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { Button, Field, Banner } from "@/components/ui";
import { checkUsername, usernameFromName } from "@/lib/username";
import { colors, radius, spacing, type } from "@/lib/theme";
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
  // Mirrors the website: the field is filled from the first name until the
  // person edits it themselves, at which point what they typed wins. Typing a
  // name and getting a ready-made username is the whole point — the previous
  // version only reacted to the username field, so typing "Alex" offered
  // nothing at all.
  const [manualUsername, setManualUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [busy, setBusy] = useState(false);
  const [taken, setTaken] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const username = usernameTouched ? manualUsername : usernameFromName(firstName);

  // Ask the server as they type, debounced, and abort the in-flight question
  // when the next keystroke arrives — otherwise a slow reply for "ale" can
  // land after a fast one for "alex" and label a free name as taken.
  useEffect(() => {
    const candidate = username.trim().toLowerCase();
    // Nothing is set synchronously here: clearing the previous answer belongs
    // to the keystroke that invalidated it, and doing it in the effect body
    // costs an extra render pass on every character.
    if (usernameProblem(candidate)) return;

    const controller = new AbortController();
    if (checkTimer.current) clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(() => {
      void checkUsername(candidate, controller.signal)
        .then((result) => {
          setTaken(!result.available);
          setSuggestions(result.available ? [] : result.suggestions);
        })
        .catch(() => {
          // Offline, or the request was superseded. Say nothing rather than
          // claiming a perfectly good username is unavailable.
        });
    }, 400);

    return () => {
      controller.abort();
      if (checkTimer.current) clearTimeout(checkTimer.current);
    };
  }, [username]);

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
      // Not the tabs: a code has just been emailed and until this screen
      // existed there was nowhere in the app to type it. Skippable — see
      // app/verify-email.
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
        {/* No heading here: the navigation bar above already says it, and
            repeating it wastes the top third of a phone screen. */}
        <Text style={styles.subtitle}>
          Your invitation is saved as soon as you do, and answers arrive here.
        </Text>

        {!!error && <Banner message={error} />}

        <Field
          label="Your first name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            // While the username is still derived from this, the previous
            // verdict describes a name that no longer exists.
            if (!usernameTouched) {
              setTaken(false);
              setSuggestions([]);
            }
          }}
          error={fieldErrors.firstName}
          autoComplete="given-name"
          placeholder="Alex"
        />
        <Field
          label="Username"
          value={username}
          onChangeText={(text) => {
            setUsernameTouched(true);
            setManualUsername(text);
            // The previous verdict describes a name they are no longer typing.
            setTaken(false);
            setSuggestions([]);
          }}
          error={fieldErrors.username ?? (taken ? "That username is taken." : null)}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="alex"
        />

        {/* Tappable, because the whole point is not having to invent another
            one. Only rendered when the typed name is actually taken, so the
            row never appears as noise under a name that is fine. */}
        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Try:</Text>
            {suggestions.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setUsernameTouched(true);
                  setManualUsername(option);
                  setTaken(false);
                  setSuggestions([]);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Use the username ${option}`}
                style={({ pressed }) => [styles.suggestion, pressed && styles.suggestionPressed]}
              >
                <Text style={styles.suggestionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        )}

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
          hint={PASSWORD_HINT}
        />

        <Button label="Create account" onPress={submit} loading={busy} />
        <Button label="I already have an account" variant="quiet" onPress={() => router.replace("/login")} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: -spacing.xs,
  },
  suggestionsLabel: { ...type.small, color: colors.muted },
  suggestion: {
    backgroundColor: colors.rose100,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  suggestionPressed: { backgroundColor: colors.rose200 },
  suggestionText: { ...type.small, color: colors.rose700, fontWeight: "600" },
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: { padding: spacing.lg, gap: spacing.md },
  subtitle: { ...type.small, marginBottom: spacing.sm },
});
