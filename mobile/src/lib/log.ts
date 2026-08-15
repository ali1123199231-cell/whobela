/**
 * App-side logging.
 *
 * Mirrors the server's shape — one JSON object per line, dotted event names —
 * so a problem can be followed across the two by grepping the same words in
 * `adb logcat` and `docker logs`.
 *
 * Everything goes through `console`, which React Native forwards to logcat
 * under the `ReactNativeJS` tag. That makes it readable with:
 *
 *   adb logcat -s ReactNativeJS:V | grep whobela
 *
 * Release builds keep these. They are cheap, and the alternative is a phone in
 * someone else's hand doing something inexplicable with no way to ask it why.
 * Secrets are redacted on the same terms as the server.
 */

type Level = "debug" | "info" | "warn" | "error";
type Context = Record<string, unknown>;

const SECRET_KEYS = ["password", "token", "secret", "authorization", "auth", "credential"];

const isSecret = (key: string) => {
  const k = key.toLowerCase();
  return SECRET_KEYS.some((s) => k.includes(s));
};

function redact(context: Context): Context {
  const out: Context = {};
  for (const [key, value] of Object.entries(context)) {
    if (value === undefined) continue;
    if (isSecret(key)) {
      out[key] = typeof value === "string" ? `[redacted:${value.length}]` : "[redacted]";
    } else if (key.toLowerCase().includes("email") && typeof value === "string") {
      const [user, domain] = value.split("@");
      out[key] = domain ? `${user.slice(0, 2)}***@${domain}` : "***";
    } else if (value instanceof Error) {
      out[key] = { message: value.message, name: value.name };
    } else {
      out[key] = value;
    }
  }
  return out;
}

function emit(level: Level, event: string, context: Context = {}) {
  try {
    // The "whobela" prefix is what makes these greppable in a logcat stream
    // that is otherwise full of every other process on the phone.
    const line = `whobela ${JSON.stringify({ lvl: level, evt: event, ...redact(context) })}`;
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  } catch {
    // Never let logging break the screen it is describing.
  }
}

export const log = {
  debug: (event: string, context?: Context) => emit("debug", event, context),
  info: (event: string, context?: Context) => emit("info", event, context),
  warn: (event: string, context?: Context) => emit("warn", event, context),
  error: (event: string, context?: Context) => emit("error", event, context),
};
