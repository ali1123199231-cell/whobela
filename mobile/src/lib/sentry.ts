import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { APP_VERSION, VERSION_CODE } from "./config";
import { log } from "./log";

/**
 * Crash and error reporting to Sentry.
 *
 * Runs alongside the reports we post to /api/app/error rather than replacing
 * them. The two answer different questions: ours puts a stack in the server log
 * next to the request that preceded it, which is what you want while debugging;
 * Sentry groups recurring crashes, tracks them per release, and symbolicates —
 * which is what you want when a build is live and you need to know how many
 * people it is affecting.
 *
 * The DSN is a publishable client key, not a secret. It identifies where to
 * send events and grants nothing else, which is why it lives in app config
 * where a build can never silently lack it.
 */

let started = false;

export function initSentry() {
  if (started) return;

  const dsn = (Constants.expoConfig?.extra as { sentryDsn?: string } | undefined)?.sentryDsn;
  if (!dsn) {
    // Development, or a build made before the DSN existed. Not an error —
    // reporting simply stays local.
    log.info("sentry.disabled", { reason: "no dsn in app config" });
    return;
  }

  try {
    Sentry.init({
      dsn,
      // Tying events to a build is the difference between "the app crashes" and
      // "the app crashes on versionCode 3 only", which is the question that
      // actually gets asked after a release.
      release: `com.whobela.app@${APP_VERSION}+${VERSION_CODE}`,
      dist: String(VERSION_CODE),
      environment: __DEV__ ? "development" : "production",
      // Off deliberately. Performance tracing on a free plan burns the event
      // quota that crashes need, and this app's slow paths are already timed by
      // our own logs.
      tracesSampleRate: 0,
      // The inbox holds names, phone numbers and messages from people who never
      // agreed to anything with us. Screenshots and view hierarchies of that
      // screen have no business leaving the phone.
      attachScreenshot: false,
      attachViewHierarchy: false,
      sendDefaultPii: false,
      beforeSend(event) {
        // Belt and braces: strip anything that could carry a contact detail.
        if (event.user) {
          event.user = { id: event.user.id };
        }
        return event;
      },
    });
    started = true;
    log.info("sentry.started", { release: `${APP_VERSION}+${VERSION_CODE}`, dev: __DEV__ });
  } catch (error) {
    // A reporting tool that breaks the app it reports on is worse than none.
    log.error("sentry.initFailed", { error: error as Error });
  }
}

/** Associates events with an account, by id only — never an email. */
export function setSentryUser(userId: string | null) {
  if (!started) return;
  try {
    Sentry.setUser(userId ? { id: userId } : null);
  } catch {
    // Never worth failing a sign-in over.
  }
}
