/**
 * The same rules the server enforces, checked before the request goes out.
 *
 * Kept in step with src/lib/validation.ts in the web app deliberately: the
 * server remains the authority and rejects anything wrong regardless, but
 * finding out about a weak password after a round trip — on a phone, on mobile
 * data — is a worse way to learn it.
 */

export const usernamePattern = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;

export const PASSWORD_HINT = "At least 8 characters with a letter, a number, and a symbol.";

export function passwordProblem(password: string): string | null {
  if (password.length < 8) return PASSWORD_HINT;
  if (!/[A-Za-z]/.test(password)) return PASSWORD_HINT;
  if (!/\d/.test(password)) return PASSWORD_HINT;
  if (!/[^A-Za-z0-9]/.test(password)) return PASSWORD_HINT;
  return null;
}

export function emailProblem(email: string): string | null {
  // Deliberately loose. The server validates properly, and an over-strict
  // client-side pattern is how people with perfectly good addresses get told
  // their email is invalid.
  if (!email.includes("@") || !email.includes(".")) return "That doesn't look like an email address.";
  return null;
}

export function usernameProblem(username: string): string | null {
  if (!usernamePattern.test(username)) {
    return "Use 3-32 lowercase letters, numbers, or hyphens.";
  }
  return null;
}

export function firstNameProblem(firstName: string): string | null {
  if (firstName.trim().length < 1) return "Tell us what to call you.";
  if (firstName.length > 60) return "That's a little too long.";
  return null;
}
