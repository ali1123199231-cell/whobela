/**
 * The site's palette, ported.
 *
 * Not a stylistic preference: the invitation editor is the web UI in a WebView,
 * and it is the screen people spend the longest on. Anything native wrapped
 * around it that used a different palette would announce the seam every time
 * they opened it. These are the same Tailwind rose values the site is built on.
 */
export const colors = {
  rose50: "#FFF1F2",
  rose100: "#FFE4E6",
  rose200: "#FECDD3",
  rose300: "#FDA4AF",
  rose400: "#FB7185",
  rose500: "#F43F5E",
  rose600: "#E11D48",
  rose700: "#BE123C",
  rose900: "#881337",
  rose950: "#4C0519",

  white: "#FFFFFF",
  // Body copy on the site is rose-700 at 80% over rose-50 rather than a true
  // grey, which is what keeps it from looking like a form.
  ink: "#4C0519",
  muted: "#9F5A6B",
  border: "#FECDD3",

  danger: "#BE123C",
  success: "#15803D",
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const type = {
  title: { fontSize: 24, fontWeight: "600" as const, color: colors.rose950 },
  heading: { fontSize: 18, fontWeight: "600" as const, color: colors.rose950 },
  body: { fontSize: 15, color: colors.rose950 },
  small: { fontSize: 13, color: colors.muted },
} as const;
