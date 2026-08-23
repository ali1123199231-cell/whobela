import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasPermission, canAskAgain, requestPermission } from "@/lib/notifications";
import { Button } from "./ui";
import { colors, radius, spacing, type } from "@/lib/theme";

const DISMISSED_KEY = "whobela.push.dismissed";

/**
 * Asks for notifications at the moment the value is obvious.
 *
 * Rendered by the inbox only once a real answer has arrived, which is the same
 * rule the web prompt follows. Android 13 shows the system dialog once and then
 * remembers the refusal forever, so this is the one shot — spending it on first
 * launch, before anyone knows what the app is for, is how it gets denied.
 */
export function PushPrompt({ onDone }: { onDone?: () => void } = {}) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      if (await hasPermission()) return;
      // Android has stopped offering the dialog, so there is nothing this
      // prompt could achieve except take up space.
      if (!(await canAskAgain())) return;
      const dismissed = await AsyncStorage.getItem(DISMISSED_KEY);
      if (dismissed === "1") return;
      setVisible(true);
    })();
  }, []);

  if (!visible) return null;

  const enable = async () => {
    setBusy(true);
    try {
      await requestPermission();
    } finally {
      setBusy(false);
      // Hidden either way. If they granted it there is nothing left to ask; if
      // they refused, Android will not show the dialog again.
      setVisible(false);
      onDone?.();
    }
  };

  const dismiss = async () => {
    await AsyncStorage.setItem(DISMISSED_KEY, "1").catch(() => {});
    setVisible(false);
    onDone?.();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Know the moment someone answers</Text>
      <Text style={styles.body}>
        We&apos;ll send a notification the second a reply arrives, so you don&apos;t have to keep
        checking.
      </Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button label="Not now" variant="secondary" onPress={() => void dismiss()} />
        </View>
        <View style={styles.action}>
          <Button label="Turn on" onPress={() => void enable()} loading={busy} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.rose100,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { ...type.heading, fontSize: 16 },
  body: { ...type.small, color: colors.rose700 },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  action: { flex: 1 },
});
