import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { PLAY_URL } from "./config";
import { log } from "./log";

const SEEN_KEY = "whobela.review.answerSeenAt";
const SETTLED_KEY = "whobela.review.settled";
const SNOOZED_KEY = "whobela.review.snoozedUntil";
const SNOOZE_DAYS = 60;

/**
 * When this launch began. Not a stored value — the point is that it changes
 * every time the app starts, which is what lets "they saw an answer in an
 * earlier session" be expressed as a single comparison.
 */
const SESSION_STARTED_AT = Date.now();

/**
 * Decides whether to ask for a review, and when.
 *
 * The rule is: they must have had an answer waiting on a *previous* visit.
 * The first time an answer appears the app says nothing at all — that moment
 * belongs to reading who said yes, and the earlier version interrupted it,
 * covering the answer with a ratings card before it had been read.
 *
 * Deliberately no longer the Play in-app review API. That card cannot be put
 * behind a question about how someone feels — Play's policy forbids asking
 * anything before it, and forbids triggering it from a button at all. Asking
 * first is what we want here, so the happy path ends at the store listing
 * instead, which is the route Google's own documentation points to for a
 * call-to-action. The trade is real: rating on the listing takes more effort
 * than the one-tap card, so fewer people will finish.
 */
export async function reviewPromptDue(): Promise<boolean> {
  try {
    if (await AsyncStorage.getItem(SETTLED_KEY)) return false;

    const snoozedUntil = Number(await AsyncStorage.getItem(SNOOZED_KEY));
    if (Number.isFinite(snoozedUntil) && Date.now() < snoozedUntil) return false;

    const raw = await AsyncStorage.getItem(SEEN_KEY);
    if (!raw) {
      // First sighting. Record it and stay quiet — this is the visit where
      // they are reading the answer.
      await AsyncStorage.setItem(SEEN_KEY, String(Date.now()));
      return false;
    }

    const seenAt = Number(raw);
    if (!Number.isFinite(seenAt)) return false;

    // Only once the sighting belongs to an earlier run of the app. Tab
    // switching refetches the inbox constantly, so "a later fetch" would fire
    // seconds after the first and be exactly the interruption we removed.
    return seenAt < SESSION_STARTED_AT;
  } catch {
    // Storage is unreadable; never let that turn into a prompt on every load.
    return false;
  }
}

/** They answered, either way. Do not raise it again. */
export async function settleReviewPrompt(outcome: string): Promise<void> {
  log.info("review.settled", { outcome });
  await AsyncStorage.setItem(SETTLED_KEY, "1").catch(() => {});
}

/** "Not now" — ask again in a couple of months, rather than never. */
export async function snoozeReviewPrompt(): Promise<void> {
  log.info("review.snoozed");
  const until = Date.now() + SNOOZE_DAYS * 86_400_000;
  await AsyncStorage.setItem(SNOOZED_KEY, String(until)).catch(() => {});
}

/**
 * Opens the Play listing, where the star row is.
 *
 * market:// goes straight to the Play app; the https URL is the fallback for a
 * device without it. Android offers no deep link into the review composer
 * itself, so the listing is as close as it is possible to get — and, as with
 * the in-app card, nothing tells us whether a review was actually left.
 */
export async function openPlayListing(): Promise<void> {
  const market = `market://details?id=com.whobela.app`;
  try {
    if (await Linking.canOpenURL(market)) {
      await Linking.openURL(market);
      return;
    }
  } catch {
    // Fall through to the web listing.
  }
  await Linking.openURL(PLAY_URL).catch((failure: Error) => {
    log.warn("review.openFailed", { message: failure.message });
  });
}
