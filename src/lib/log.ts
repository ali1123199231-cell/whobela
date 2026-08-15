/**
 * Structured logging.
 *
 * One JSON object per line, because the only place these are ever read is
 * `docker logs whobela-app`, and a shape that greps and parses cleanly beats a
 * sentence every time. Freeform `console.log` strings are fine until you need
 * to answer "did that notification actually send, and to how many devices" at
 * which point they are useless.
 *
 * Event names are dotted and hierarchical — `push.fcm.sent`, `auth.login.fail`
 * — so a whole area can be followed with one grep.
 *
 * Nothing here throws. A logger that can break a request is worse than no
 * logger, and this one runs on paths that are already handling failures.
 */

type Level = "debug" | "info" | "warn" | "error";

type Context = Record<string, unknown>;

/**
 * Keys whose values must never reach a log line, matched case-insensitively on
 * substrings so `passwordHash`, `access_token` and `p256dh` are all caught
 * without having to enumerate every spelling.
 */
const SECRET_KEYS = [
  "password", "token", "secret", "authorization", "cookie", "auth",
  "privatekey", "private_key", "p256dh", "credential", "apikey", "api_key",
];

const isSecret = (key: string) => {
  const k = key.toLowerCase();
  return SECRET_KEYS.some((s) => k.includes(s));
};

/**
 * An email is the one identifier that makes a log line personally identifying,
 * and these lines live in a container log nobody has audited. Enough is kept to
 * recognise an address you already know, not enough to harvest one you don't.
 */
export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  // The marker is unconditional: with `user.length > 2` gating it, a
  // one-character local part came through in full and looked like a complete
  // address rather than a masked one.
  return `${user.slice(0, 2)}***@${domain}`;
}

function redact(context: Context): Context {
  const out: Context = {};
  for (const [key, value] of Object.entries(context)) {
    if (value === undefined) continue;
    // Only strings can carry a secret. Redacting a boolean or a count because
    // the key happens to contain "token" throws away the useful half of the
    // line — `tokenInBody: true` is exactly the fact worth logging, and it
    // discloses nothing.
    if (isSecret(key) && typeof value === "string") {
      // Length is genuinely useful — "did a token arrive at all" is a real
      // question — and it reveals nothing.
      out[key] = `[redacted:${value.length}]`;
      continue;
    }
    if (isSecret(key) && (typeof value === "object" && value !== null)) {
      out[key] = "[redacted]";
      continue;
    }
    if (key.toLowerCase().includes("email") && typeof value === "string") {
      out[key] = maskEmail(value);
      continue;
    }
    if (value instanceof Error) {
      out[key] = { message: value.message, name: value.name };
      continue;
    }
    out[key] = value;
  }
  return out;
}

const LEVEL_ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

// Debug lines are noise in production but the whole point in development.
// LOG_LEVEL overrides for the times production is the only place a bug lives.
function minLevel(): number {
  const configured = (process.env.LOG_LEVEL ?? "").toLowerCase() as Level;
  if (configured in LEVEL_ORDER) return LEVEL_ORDER[configured];
  return process.env.NODE_ENV === "production" ? LEVEL_ORDER.info : LEVEL_ORDER.debug;
}

function emit(level: Level, event: string, context: Context = {}) {
  try {
    if (LEVEL_ORDER[level] < minLevel()) return;
    const line = JSON.stringify({
      t: new Date().toISOString(),
      lvl: level,
      evt: event,
      ...redact(context),
    });
    // error/warn to stderr so `docker logs` separation still works.
    if (level === "error" || level === "warn") console.error(line);
    else console.log(line);
  } catch {
    // A logger that throws would take down the request it was describing.
  }
}

export const log = {
  debug: (event: string, context?: Context) => emit("debug", event, context),
  info: (event: string, context?: Context) => emit("info", event, context),
  warn: (event: string, context?: Context) => emit("warn", event, context),
  error: (event: string, context?: Context) => emit("error", event, context),
};

/**
 * Identifies the caller for every log line on a request.
 *
 * `x-whobela-client` is sent by the app (`android/1.0.0(2)`) and absent from
 * browsers, which makes it the cheapest way to tell in a log whether a problem
 * belongs to the app, the website, or one particular app release.
 */
export function clientOf(request: Request): string {
  return request.headers.get("x-whobela-client") ?? "web";
}

/** Wall-clock duration helper, so slow paths are visible without a profiler. */
export function timer() {
  const started = Date.now();
  return () => Date.now() - started;
}
