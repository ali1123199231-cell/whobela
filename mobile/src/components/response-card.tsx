import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { InboxResponse } from "@/lib/inbox";
import { reachOptions, openReach, type ReachOption } from "@/lib/reach";
import { addToCalendar } from "@/lib/calendar";
import { formatChosenDate, formatRelative } from "@/lib/format";
import { API_BASE } from "@/lib/config";
import { colors, radius, spacing, type } from "@/lib/theme";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  whatsapp: "logo-whatsapp",
  instagram: "logo-instagram",
  tiktok: "logo-tiktok",
  facebook: "logo-facebook",
  sms: "chatbubble",
  call: "call",
  email: "mail",
};

export function ResponseCard({ response }: { response: InboxResponse }) {
  const [savingCalendar, setSavingCalendar] = useState(false);
  const options = reachOptions(response);

  const reach = async (option: ReachOption) => {
    const opened = await openReach(option);
    if (!opened) {
      Alert.alert(
        `Can't open ${option.label}`,
        `Nothing on this phone handles that. Their details are ${option.value}.`
      );
    }
  };

  const calendar = async () => {
    setSavingCalendar(true);
    try {
      const outcome = await addToCalendar(response);
      if (outcome === "denied") {
        Alert.alert("Calendar access needed", "Allow calendar access to add this date.");
      } else if (outcome === "unavailable") {
        Alert.alert("No calendar found", "This phone has no calendar we can add the date to.");
      } else if (outcome === "unreadable") {
        Alert.alert("Couldn't read that date", "The date on this answer isn't in a format we understand.");
      }
      // "saved" and "opened" both speak for themselves: the system's own event
      // screen has already appeared, so a confirmation here would just be a
      // second dialog saying what the first one showed.
    } finally {
      setSavingCalendar(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {response.photoUrl ? (
          <Image source={{ uri: `${API_BASE}${response.photoUrl}` }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoFallback]}>
            <Ionicons name="heart" size={20} color={colors.rose400} />
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.name}>{response.recipientName} said yes</Text>
          <Text style={styles.when}>
            {formatChosenDate(response.chosenDate)} at {response.chosenTime}
          </Text>
        </View>
        <Text style={styles.ago}>{formatRelative(response.createdAt)}</Text>
      </View>

      {!!response.message && <Text style={styles.message}>“{response.message}”</Text>}

      {response.preferences.length > 0 && (
        <Text style={styles.preferences}>They picked: {response.preferences.join(", ")}</Text>
      )}

      {options.length > 0 && (
        <View style={styles.actions}>
          {options.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => void reach(option)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${option.label} for ${option.value}`}
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            >
              <Ionicons name={ICONS[option.key] ?? "open-outline"} size={15} color={colors.rose600} />
              <Text style={styles.chipLabel}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        onPress={() => void calendar()}
        disabled={savingCalendar}
        accessibilityRole="button"
        style={({ pressed }) => [styles.calendar, pressed && styles.chipPressed]}
      >
        <Ionicons name="calendar-outline" size={16} color={colors.rose600} />
        <Text style={styles.calendarLabel}>Add to calendar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  photo: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.rose100 },
  photoFallback: { alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  name: { ...type.heading, fontSize: 16 },
  when: { ...type.small, marginTop: 2 },
  ago: { ...type.small, fontSize: 11, color: colors.rose300 },
  message: { ...type.body, fontStyle: "italic", color: colors.rose700 },
  preferences: type.small,
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.rose200,
    backgroundColor: colors.rose50,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    minHeight: 36,
  },
  chipPressed: { opacity: 0.7 },
  chipLabel: { fontSize: 13, fontWeight: "600", color: colors.rose600 },
  calendar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  calendarLabel: { fontSize: 13, fontWeight: "600", color: colors.rose600 },
});
