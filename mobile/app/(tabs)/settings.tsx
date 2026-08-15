import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { shareInvitation } from "@/lib/reach";
import { API_BASE, APP_VERSION, VERSION_CODE, invitationUrl } from "@/lib/config";
import { clearCache } from "@/lib/inbox";
import { colors, radius, spacing, type } from "@/lib/theme";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const share = () => void shareInvitation(invitationUrl(user.username), user.firstName);

  const confirmSignOut = () => {
    Alert.alert("Sign out?", "You'll need your password to get back in.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          setSigningOut(true);
          void (async () => {
            // The cached inbox goes with the session. Someone handing the phone
            // over should not leave their answers behind on the sign-in screen.
            await clearCache();
            await signOut();
            router.replace("/editor");
          })();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.name}>{user.firstName ?? user.username}</Text>
        <Text style={styles.detail}>{user.email}</Text>
        <Text style={styles.detail}>whobela.com/{user.username}</Text>
        {!user.emailVerified && (
          <Text style={styles.warning}>Your email isn&apos;t verified yet.</Text>
        )}
      </View>

      <Section title="Your invitation">
        <Row icon="share-social" label="Share your link" onPress={share} />
        <Row
          icon="eye"
          label="See what recipients see"
          onPress={() => void Linking.openURL(invitationUrl(user.username))}
        />
      </Section>

      <Section title="Settings">
        <Row
          icon="notifications"
          label="Notifications"
          hint="Opens Android settings"
          onPress={() => void Linking.openSettings()}
        />
        <Row
          icon="person"
          label="Account and password"
          hint="Opens the website"
          onPress={() => void Linking.openURL(`${API_BASE}/dashboard/settings`)}
        />
      </Section>

      <Section title="Whobela">
        <Row icon="help-circle" label="Help" onPress={() => void Linking.openURL(`${API_BASE}/help`)} />
        <Row
          icon="document-text"
          label="Privacy policy"
          onPress={() => void Linking.openURL(`${API_BASE}/legal/privacy`)}
        />
        <Row
          icon="document-text"
          label="Terms"
          onPress={() => void Linking.openURL(`${API_BASE}/legal/terms`)}
        />
        <Row
          icon="flag"
          label="Report a problem"
          onPress={() => void Linking.openURL(`${API_BASE}/report-abuse`)}
        />
      </Section>

      <Section title="Account">
        <Row icon="log-out" label="Sign out" onPress={confirmSignOut} disabled={signingOut} />
        {/* Play requires account deletion to be reachable from inside the app,
            not only from the website. */}
        <Row
          icon="trash"
          label="Delete your account"
          destructive
          onPress={() => void Linking.openURL(`${API_BASE}/delete-account`)}
        />
      </Section>

      <Text style={styles.version}>
        Whobela {APP_VERSION} ({VERSION_CODE})
      </Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  hint,
  onPress,
  destructive,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed, disabled && styles.rowDisabled]}
    >
      <Ionicons name={icon} size={19} color={destructive ? colors.danger : colors.rose600} />
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
        {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.rose300} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, gap: 2 },
  name: type.heading,
  detail: type.small,
  warning: { ...type.small, color: colors.danger, marginTop: spacing.xs },
  section: { gap: spacing.xs },
  sectionTitle: {
    ...type.small,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
    marginLeft: spacing.xs,
  },
  sectionBody: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rose100,
  },
  rowPressed: { backgroundColor: colors.rose50 },
  rowDisabled: { opacity: 0.5 },
  rowText: { flex: 1 },
  rowLabel: { ...type.body, fontWeight: "500" },
  rowLabelDestructive: { color: colors.danger },
  rowHint: { ...type.small, fontSize: 11 },
  version: { ...type.small, textAlign: "center", color: colors.rose300 },
});
