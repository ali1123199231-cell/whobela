import * as Calendar from "expo-calendar";
import type { InboxResponse } from "./inbox";

/**
 * Putting an accepted date into the phone's calendar.
 *
 * Everything needed is already stored — the date, the time and the timezone the
 * recipient chose — so this is one tap on the web's worst chore.
 *
 * Deliberately goes through the system's own event editor rather than writing
 * an event directly. Android has no concept of a single default calendar, so
 * writing straight to "the first writable one" can silently file a date into
 * whichever account happened to sort first — a work calendar shared with
 * colleagues, for instance. The form shows exactly what is being saved and
 * where, and lets the date be adjusted before it lands.
 */

const DEFAULT_DURATION_MINUTES = 120;

/**
 * "opened" rather than "saved" is not vagueness — Android returns `done` from
 * the event dialog whether the user saved, cancelled or deleted, and exposes no
 * way to tell which. Reporting "Saved to your calendar" would therefore be a
 * claim we cannot support, and it would be wrong precisely when someone changed
 * their mind. iOS does distinguish, so the richer outcomes stay in the type.
 */
export type CalendarOutcome =
  | "saved"
  | "opened"
  | "cancelled"
  | "denied"
  // No calendar on the device that we are allowed to write to.
  | "unavailable"
  // The stored date or time could not be parsed. Kept separate from
  // "unavailable" because they are not the same failure, and reporting a
  // parsing bug as "this phone has no calendar" sends the reader looking in
  // exactly the wrong place — which is what it did.
  | "unreadable";

/**
 * Combines the stored date and time into an instant.
 *
 * The pair is stored as the recipient chose it — "2026-09-04" and "7:00 PM" in
 * their timezone — so this builds a local Date in those parts. Constructing it
 * from a string would have the phone reinterpret it in whatever zone it is
 * currently in, and a date that moves when you fly somewhere is worse than no
 * calendar entry at all.
 */
function toStartDate(response: InboxResponse): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(response.chosenDate);
  // Twelve-hour with a meridiem — "6:00 PM" — because that is the shape the
  // server stores and validates against (TIME_SLOT_PATTERN in
  // src/lib/date-page-defaults.ts). Parsing this as 24-hour silently fails on
  // every single response.
  const timeMatch = /^(1[0-2]|[1-9]):([0-5]\d)\s*(AM|PM)$/i.exec(response.chosenTime.trim());
  if (!dateMatch || !timeMatch) return null;

  const [, year, month, day] = dateMatch;
  const [, hourStr, minute, period] = timeMatch;
  const hour12 = Number(hourStr);
  const isPm = period.toUpperCase() === "PM";
  const hour24 = isPm ? (hour12 === 12 ? 12 : hour12 + 12) : hour12 === 12 ? 0 : hour12;

  const start = new Date(Number(year), Number(month) - 1, Number(day), hour24, Number(minute), 0, 0);
  return Number.isNaN(start.getTime()) ? null : start;
}

export async function addToCalendar(response: InboxResponse): Promise<CalendarOutcome> {
  const start = toStartDate(response);
  if (!start) return "unreadable";

  // Full permission, not write-only: `writeOnly` is documented as iOS-only, and
  // picking which calendar the event lands in means listing them, which needs
  // READ_CALENDAR either way.
  const { status } = await Calendar.requestCalendarPermissions();
  if (status !== "granted") return "denied";

  const calendars = await Calendar.getCalendars();
  const target = calendars.find((c) => c.isPrimary && c.allowsModifications)
    ?? calendars.find((c) => c.allowsModifications);
  if (!target) return "unavailable";

  const end = new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);
  const notes = [
    response.message ? `“${response.message}”` : null,
    response.preferences.length > 0 ? `They picked: ${response.preferences.join(", ")}` : null,
    `Their timezone: ${response.timezone}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = await target.addEventWithForm({
    title: `Date with ${response.recipientName}`,
    startDate: start,
    endDate: end,
    notes,
  });

  if (result?.action === "saved") return "saved";
  if (result?.action === "canceled" || result?.action === "deleted") return "cancelled";
  // Android's `done`.
  return "opened";
}
