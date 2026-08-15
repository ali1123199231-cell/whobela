import { Platform } from "react-native";
import * as Device from "expo-device";
import { API_BASE, CLIENT_HEADER, CLIENT_ID, APP_VERSION, VERSION_CODE } from "./config";
import { getToken } from "./api";
import { log } from "./log";
import * as Sentry from "@sentry/react-native";

/**
 * Reports crashes to our own server.
 *
 * Runs alongside Sentry rather than instead of it. This path puts the stack in
 * the server log right next to the requests that preceded it, which is what you
 * want while debugging; Sentry groups the same crash across users and releases,
 * which is what you want once a build is live. Play Console shows clusters but
 * strips the context that says which screen and which account.
 *
 * Deliberately does not use apiFetch. That path throws on failure and logs
 * errors of its own, which during a crash is how you get a loop.
 */

async function report(payload: Record<string, unknown>) {
  try {
    const token = await getToken();
    await fetch(`${API_BASE}/api/app/error`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        [CLIENT_HEADER]: CLIENT_ID,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        appVersion: APP_VERSION,
        versionCode: VERSION_CODE,
        platform: Platform.OS,
        osVersion: String(Device.osVersion ?? ""),
        model: String(Device.modelName ?? ""),
        ...payload,
      }),
    });
  } catch {
    // The phone is crashing and possibly offline. Nothing useful left to do.
  }
}

/** Reports an error we caught ourselves and handled. */
export function reportHandled(error: unknown, context: string) {
  const e = error instanceof Error ? error : new Error(String(error));
  log.error("crash.handled", { context, message: e.message });
  void report({ message: e.message, stack: e.stack, context, fatal: false });
  try {
    Sentry.captureException(e, { tags: { context } });
  } catch {
    // Sentry may not be initialised (no DSN in development). Our own report
    // has already gone either way.
  }
}

/**
 * Installs the global handler.
 *
 * `ErrorUtils` is React Native's own hook for errors that escaped every
 * try/catch — the ones that white-screen the app. The previous handler is
 * always called afterwards, because it is what actually shows the red box in
 * development and terminates cleanly in production; replacing it outright would
 * trade a visible crash for an invisible one.
 */
export function installCrashReporter() {
  // `globalThis` rather than `global`: the latter is a Node type that the
  // React Native TS config does not declare, though both exist at runtime.
  const globalAny = globalThis as unknown as {
    ErrorUtils?: {
      getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
      setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
    };
  };
  const ErrorUtils = globalAny.ErrorUtils;
  if (!ErrorUtils) return;

  const previous = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    log.error("crash.global", { message: error?.message, fatal: !!isFatal });
    void report({
      message: error?.message ?? "Unknown error",
      stack: error?.stack,
      context: "global",
      fatal: !!isFatal,
    });
    previous(error, isFatal);
  });

  log.info("crash.reporter.installed", { appVersion: APP_VERSION, versionCode: VERSION_CODE });
}
