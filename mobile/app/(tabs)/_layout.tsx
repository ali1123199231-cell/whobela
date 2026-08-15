import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.rose600} size="large" />
      </View>
    );
  }

  // Reached directly by a notification tap or a deep link while signed out.
  if (!user) return <Redirect href="/editor" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.rose600,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border },
        // Labels are kept short because a tab is a third of the screen wide
        // and cannot wrap: "Your invitation" clipped to "Your invitatio…" at
        // the largest system font size. Deliberately not disabling font
        // scaling to fix it — that would help the layout by hurting the people
        // the setting exists for.
        headerStyle: { backgroundColor: colors.rose50 },
        headerTintColor: colors.rose950,
        headerTitleStyle: { fontWeight: "600" },
        sceneStyle: { backgroundColor: colors.rose50 },
      }}
    >
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Answers",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="invitation"
        options={{
          title: "Invitation",
          tabBarIcon: ({ color, size }) => <Ionicons name="create" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.rose50 },
});
