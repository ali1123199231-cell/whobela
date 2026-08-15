import { Linking, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "./ui";
import { colors, spacing, type } from "@/lib/theme";

/**
 * The wall shown when the server no longer supports this build.
 *
 * There is deliberately no way past it. It exists for the case where a release
 * shipped with a bug bad enough that letting it keep talking to the API is
 * worse than making people update — losing data, sending wrong notifications —
 * and an escape hatch would defeat the point of having the lever at all.
 */
export function UpdateRequired({ updateUrl }: { updateUrl: string }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../../assets/splash-icon.png")} style={styles.icon} />
        <Text style={styles.title}>Time for an update</Text>
        <Text style={styles.body}>
          This version of Whobela is out of date and can&apos;t talk to the server any more. The
          update takes a moment and everything will be where you left it.
        </Text>
        <Button label="Update Whobela" onPress={() => void Linking.openURL(updateUrl)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.rose50 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  icon: { width: 96, height: 96, borderRadius: 24, marginBottom: spacing.sm },
  title: { ...type.title, textAlign: "center" },
  body: { ...type.body, color: colors.muted, textAlign: "center", marginBottom: spacing.md },
});
