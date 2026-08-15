import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiFetch } from "./api";
import { APP_VERSION } from "./config";
import { colors } from "./theme";

const CHANNEL_ID = "responses";

/**
 * Notifications for the app.
 *
 * Permission is deliberately never requested from here. The web prompt asks
 * only once someone has an answer waiting, because that is the moment the value
 * is self-evident, and Android 13 gives exactly one chance at the system dialog
 * before the answer becomes permanent. `requestPermission` is called from the
 * inbox for that reason; everything else here assumes the answer is already in.
 */

// Foreground behaviour: someone staring at the inbox does not need a banner
// telling them what they are already looking at, but the list should update.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * The channel must exist before a token can be issued, and it is also what
 * gives someone granular control in system settings rather than an all-or-
 * nothing switch for the whole app.
 */
export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Answers",
    description: "When someone answers your invitation.",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: colors.rose600,
  });
}

export async function hasPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/**
 * Returns whether the system dialog can still be shown. Once someone has
 * declined, Android stops presenting it, and asking again does nothing but
 * return the same denial — so the caller should stop offering.
 */
export async function canAskAgain(): Promise<boolean> {
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.status !== "granted" && permissions.canAskAgain;
}

export async function requestPermission(): Promise<boolean> {
  await ensureChannel();
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;
  await registerForPush();
  return true;
}

/**
 * Tells the server which device to notify.
 *
 * Silent when permission has not been granted: this runs on every launch, and
 * a phone that has said no should not produce an error every time the app opens.
 */
export async function registerForPush(): Promise<void> {
  try {
    if (Platform.OS !== "android") return;
    if (!(await hasPermission())) return;

    await ensureChannel();
    const token = await Notifications.getDevicePushTokenAsync();
    if (!token?.data) return;

    await apiFetch("/api/push/device", {
      method: "POST",
      body: { token: token.data, platform: "android", appVersion: APP_VERSION },
    });
  } catch (error) {
    // Never fatal. Failing to register is a notification someone misses, not a
    // reason to interrupt whatever they opened the app to do.
    console.warn("[push] could not register this device", error);
  }
}

export async function unregisterPush(): Promise<void> {
  try {
    if (Platform.OS !== "android") return;
    if (!(await hasPermission())) return;
    const token = await Notifications.getDevicePushTokenAsync();
    if (!token?.data) return;
    await apiFetch("/api/push/device", { method: "DELETE", body: { token: token.data } });
  } catch {
    // Sign-out must complete regardless — the token is pruned server-side the
    // first time a send to it fails anyway.
  }
}

/**
 * The path a notification wants to open, or null.
 *
 * The server sends a site path such as /dashboard/inbox; the app maps that onto
 * its own routes, since they do not correspond one to one.
 */
export function routeForNotification(data: unknown): string | null {
  const url = (data as { url?: unknown } | null)?.url;
  if (typeof url !== "string") return null;
  if (url.startsWith("/dashboard/inbox")) return "/(tabs)/inbox";
  if (url.startsWith("/dashboard")) return "/(tabs)/invitation";
  return null;
}
