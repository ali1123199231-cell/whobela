import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

/**
 * Decides what the app opens on.
 *
 * Signed out, that is the editor rather than a login screen — the same choice
 * the web app makes for Play. Someone who installs from the store can shape a
 * real invitation and only meet the signup form once they want to keep it, and
 * a reviewer opening the app cold sees a working product rather than a wall.
 */
export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.rose600} size="large" />
      </View>
    );
  }

  return <Redirect href={user ? "/(tabs)/inbox" : "/editor"} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.rose50 },
});
