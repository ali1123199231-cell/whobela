import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { VERSION_CODE } from "@/lib/config";
import { routeForNotification, ensureChannel } from "@/lib/notifications";
import { installCrashReporter } from "@/lib/crash";
import { initSentry } from "@/lib/sentry";
import { UpdateRequired } from "@/components/update-required";
import { colors } from "@/lib/theme";

type AppConfig = { minVersionCode: number; latestVersionCode: number; updateUrl: string };

export default function RootLayout() {
  const [blocked, setBlocked] = useState(false);
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);

  // The update gate. Checked once per launch, before anything else matters:
  // a build the server has disowned should say so rather than fail in ways
  // nobody can diagnose from a crash report.
  useEffect(() => {
    void (async () => {
      try {
        const config = await apiFetch<AppConfig>("/api/app/config", { anonymous: true });
        if (VERSION_CODE > 0 && VERSION_CODE < config.minVersionCode) {
          setUpdateUrl(config.updateUrl);
          setBlocked(true);
        }
      } catch {
        // Offline, or the server is down. Neither is a reason to lock someone
        // out of an app whose cached inbox still works.
      }
    })();
  }, []);

  useEffect(() => {
    void ensureChannel();
  }, []);

  // Both installed before anything else can throw, so a crash on the very
  // first screen still reaches somewhere rather than just closing the app.
  useEffect(() => {
    initSentry();
    installCrashReporter();
  }, []);

  // Tapping a notification should land on the thing it was about. Two paths:
  // one for a notification tapped while the app was running, and one for the
  // notification that launched it from cold.
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = routeForNotification(response.notification.request.content.data);
      if (route) router.push(route as never);
    });

    void (async () => {
      const initial = await Notifications.getLastNotificationResponseAsync();
      if (!initial) return;
      const route = routeForNotification(initial.notification.request.content.data);
      if (route) router.push(route as never);
    })();

    return () => subscription.remove();
  }, []);

  if (blocked && updateUrl) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <UpdateRequired updateUrl={updateUrl} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.rose50 },
            headerTintColor: colors.rose950,
            headerTitleStyle: { fontWeight: "600" },
            contentStyle: { backgroundColor: colors.rose50 },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="editor" options={{ title: "Your invitation" }} />
          <Stack.Screen name="login" options={{ title: "Sign in" }} />
          <Stack.Screen name="signup" options={{ title: "Create your account" }} />
          {/* Without these two, expo-router falls back to the file name and the
              header reads "verify-email" and "delete-account". */}
          <Stack.Screen name="verify-email" options={{ title: "Verify your email" }} />
          <Stack.Screen name="delete-account" options={{ title: "Delete account" }} />
          <Stack.Screen name="change-email" options={{ title: "Change your email" }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
