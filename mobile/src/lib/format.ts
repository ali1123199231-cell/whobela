const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "Friday, September 4" from a stored "2026-09-04".
 *
 * Written out rather than handed to Intl: Hermes ships without the full ICU
 * data on Android, so date formatting there quietly falls back to something
 * else depending on the build. Two dozen strings is a small price for output
 * that is identical on every phone.
 */
export function formatChosenDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return iso;
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** How long ago an answer landed, for the card's corner. */
export function formatRelative(isoTimestamp: string): string {
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatChosenDate(isoTimestamp.slice(0, 10));
}

/** "Updated 3 minutes ago" for the offline cache stamp. */
export function formatCacheAge(isoTimestamp: string): string {
  return `Showing answers from ${formatRelative(isoTimestamp)}`;
}
