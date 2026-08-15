import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { colors, radius, spacing, type } from "@/lib/theme";

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "quiet";
  disabled?: boolean;
  loading?: boolean;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "quiet" && styles.buttonQuiet,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : colors.rose600} />
      ) : (
        <Text
          style={[
            styles.buttonLabel,
            variant === "primary" ? styles.buttonLabelPrimary : styles.buttonLabelSecondary,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string | null }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, !!error && styles.inputError]}
        placeholderTextColor={colors.rose300}
        accessibilityLabel={label}
      />
      {!!error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

/** A whole-screen state: loading, empty, or something went wrong. */
export function ScreenMessage({
  title,
  body,
  action,
  loading,
}: {
  title?: string;
  body?: string;
  action?: { label: string; onPress: () => void };
  loading?: boolean;
}) {
  return (
    <View style={styles.screenMessage}>
      {loading && <ActivityIndicator color={colors.rose600} size="large" />}
      {!!title && <Text style={styles.screenMessageTitle}>{title}</Text>}
      {!!body && <Text style={styles.screenMessageBody}>{body}</Text>}
      {!!action && (
        <View style={styles.screenMessageAction}>
          <Button label={action.label} onPress={action.onPress} variant="secondary" />
        </View>
      )}
    </View>
  );
}

/** Inline, non-blocking failure — used where a screen already has content. */
export function Banner({ message, tone = "error" }: { message: string; tone?: "error" | "info" }) {
  return (
    <View style={[styles.banner, tone === "info" && styles.bannerInfo]}>
      <Text style={[styles.bannerText, tone === "info" && styles.bannerTextInfo]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  buttonPrimary: { backgroundColor: colors.rose600 },
  buttonSecondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.rose200 },
  buttonQuiet: { backgroundColor: "transparent" },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { fontSize: 16, fontWeight: "600" },
  buttonLabelPrimary: { color: colors.white },
  buttonLabelSecondary: { color: colors.rose600 },

  field: { gap: spacing.xs },
  fieldLabel: { ...type.small, color: colors.rose900, fontWeight: "600" },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    color: colors.rose950,
    fontSize: 16,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { ...type.small, color: colors.danger },

  screenMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  screenMessageTitle: { ...type.heading, textAlign: "center" },
  screenMessageBody: { ...type.body, color: colors.muted, textAlign: "center" },
  screenMessageAction: { marginTop: spacing.sm },

  banner: {
    backgroundColor: colors.rose100,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bannerInfo: { backgroundColor: colors.rose50 },
  bannerText: { ...type.small, color: colors.rose700 },
  bannerTextInfo: { color: colors.muted },
});
