import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { log } from "./log";

const ASKED_KEY = "whobela.review.askedAt";
const COOLDOWN_DAYS = 120;

/**
 * Asks Play for a rating at the moment someone has just been told yes.
 *
 * Whobela shipped to production with no ratings at all, which means the store
 * listing shows no stars — and a listing with no stars converts badly for the
 * few people who reach it. This is the fix, and the inbox is the only honest
 * place for it: the app has just delivered the entire thing it promised.
 *
 * Note what this deliberately does NOT do. Play's in-app review policy forbids
 * asking the user anything before the card — no "do you like the app?", no
 * "would you rate us five stars?" — and forbids putting it behind a button,
 * since the quota may silently swallow the call and leave a dead control on
 * screen. So it is fired unconditionally, from an event rather than a tap, and
 * anyone with a complaint instead of a rating is served by the contact row in
 * Settings, which is always there and is not wired to this.
 */
export async function maybeRequestReview(): Promise<void> {
  try {
    // False when the device is too old or the store URLs are missing, in which
    // case requestReview would be a no-op we'd keep re-arming forever.
    if (!(await StoreReview.hasAction())) return;

    const raw = await AsyncStorage.getItem(ASKED_KEY);
    const askedAt = Number(raw);
    if (Number.isFinite(askedAt) && Date.now() - askedAt < COOLDOWN_DAYS * 86_400_000) return;

    // Recorded before the request, not after. The API resolves the same way
    // whether the card appeared or Play's own quota swallowed it — there is no
    // outcome to react to — so treating "we tried" as the thing to remember is
    // the only way this can't turn into a prompt on every single answer.
    await AsyncStorage.setItem(ASKED_KEY, String(Date.now()));
    log.info("review.requested");
    await StoreReview.requestReview();
  } catch (failure) {
    // Never worth surfacing. Someone reading who just said yes to them does
    // not need an error about a ratings prompt.
    log.warn("review.failed", { message: (failure as Error).message });
  }
}
