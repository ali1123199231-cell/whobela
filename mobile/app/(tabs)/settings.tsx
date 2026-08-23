import { useCallback, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/lib/auth";
import { shareInvitation } from "@/lib/reach";
import { API_BASE, APP_VERSION, VERSION_CODE, invitationUrl } from "@/lib/config";
import { clearCache } from "@/lib/inbox";
import { hasPermission, canAskAgain, requestPermission } from "@/lib/notifications";
import { reportHandled } from "@/lib/crash";
import { colors, radius, spacing, type } from "@/lib/theme";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [pushState, setPushState] = useState<"on" | "off" | "blocked">("off");

  // Re-read on focus, because the answer can change in Android settings while
  // the app is in the background and a stale "Off" here is a lie.
  useFocusEffect(
    useCallback(() => {
      void (async () => {
        if (await hasPermission()) setPushState("on");
        else setPushState((await canAskAgain()) ? "off" : "blocked");
      })();
    }, [])
  );

  const enableNotifications = async () => {
    if (pushState === "on") {
      // Already on: the only thing left to change lives in Android settings.
      void Linking.openSettings();
      return;
    }
    if (pushState === "blocked") {
      // Android will not show the dialog again, so sending them anywhere else
      // would just be a button that does nothing.
      Alert.alert(
        "Turn notifications on in Settings",
        "Android won't ask again, so this has to be changed in the system settings for Whobela.",
        [{ text: "Not now", style: "cancel" }, { text: "Open settings", onPress: () => void Linking.openSettings() }]
      );
      return;
    }
    const granted = await requestPermission();
    setPushState(granted ? "on" : "blocked");
  };

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
        {/* No unverified-email warning here: the tabs layout redirects an
            unverified account to the wall, so nobody in Settings has one. */}
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
        {/* A real control, not a shortcut to the system screen. Someone who
            comes looking for this has decided they want notifications, and the
            contextual prompt on the inbox only appears after an answer has
            already arrived — which is too late for the person actively
            searching the settings for it. */}
        <Row
          icon="notifications"
          label="Notifications"
          hint={
            pushState === "on" ? "On — you'll be told the moment someone answers"
            : pushState === "blocked" ? "Blocked — tap to open Android settings"
            : "Off — tap to turn on"
          }
          onPress={() => void enableNotifications()}
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
          hint="Something wrong with someone else's invitation"
          onPress={() => void Linking.openURL(`${API_BASE}/report-abuse`)}
        />
        {/* The counterweight to the ratings card on the inbox. That card is
            fired unconditionally, because Play forbids asking how someone
            feels and then routing the happy ones to it — so this is how the
            unhappy ones are served instead: always here, never conditional,
            and never mentioned by the prompt. The version travels with the
            mail because the first question about any bug is which build. */}
        <Row
          icon="chatbubble-ellipses"
          label="Something not right?"
          hint="Tell us — we read every message"
          onPress={() => void Linking.openURL(bugReportMailto())}
        />
      </Section>

      <Section title="Account">
        <Row icon="log-out" label="Sign out" onPress={confirmSignOut} disabled={signingOut} />
        {/* Play requires account deletion to be reachable from inside the app,
            not only from the website — and this used to open a page in the
            browser that told you to come back to settings and use a control
            the app did not have. It is a real screen now. */}
        <Row
          icon="trash"
          label="Delete your account"
          destructive
          onPress={() => router.push("/delete-account")}
        />
      </Section>

      {/* Long-press sends a deliberate test error through both reporting
          paths. Deliberately shipped: after a release the only way to know
          reporting still works is to make it report something, and a version
          label nobody long-presses by accident is the least intrusive place to
          put that. */}
      <Pressable
        onLongPress={() => {
          reportHandled(new Error("Whobela reporting self-test"), "settings.version.longpress");
          Alert.alert("Test error sent", "If reporting is working, this appears in the logs and in Sentry.");
        }}
        delayLongPress={1200}
        accessibilityRole="button"
        accessibilityLabel={`Whobela version ${APP_VERSION}. Long press to send a test error report.`}
      >
        <Text style={styles.version}>
          Whobela {APP_VERSION} ({VERSION_CODE})
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function bugReportMailto(): string {
  // encodeURIComponent, not URLSearchParams: the latter encodes a space as "+",
  // which mail clients paste verbatim into the subject line rather than
  // decoding it, so the mail arrives titled "Whobela+app+feedback".
  const subject = encodeURIComponent(`Whobela app feedback (${APP_VERSION} build ${VERSION_CODE})`);
  const body = encodeURIComponent("\n\n\u2014\nWhat happened, and what you expected instead:\n");
  return `mailto:support@whobela.com?subject=${subject}&body=${body}`;
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
