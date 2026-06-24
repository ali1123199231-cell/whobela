export type InviteConfig = { question: string; subtitle: string; emoji: string };
export type YesConfig = { buttonText: string; celebration: "confetti" | "hearts" | "none" };
export type NoConfig = { enabled: boolean; difficulty: "easy" | "medium" | "hard"; messages: string[] };
export type ReactionConfig = { message: string; buttonText: string };
export type SchedulingConfig = {
  availableDays: number[]; // 0 = Sunday .. 6 = Saturday
  startHour: number;
  endHour: number;
  timezone: string;
  dateRangeDays: number;
};
export type PreferenceOption = { emoji: string; label: string };
export type PreferenceConfig = { question: string; options: PreferenceOption[]; multiSelect: boolean };
export type ConfirmationConfig = { message: string; subMessage: string };

export const DEFAULT_INVITE_CONFIG: InviteConfig = {
  question: "🌸 Will you go on a date with me? 🌸",
  subtitle: "",
  emoji: "🌸",
};

export const DEFAULT_YES_CONFIG: YesConfig = {
  buttonText: "YES ❤️",
  celebration: "confetti",
};

export const DEFAULT_NO_CONFIG: NoConfig = {
  enabled: true,
  difficulty: "medium",
  messages: ["No 😢", "Are you sure?", "Think again ❤️", "Maybe yes?"],
};

export const DEFAULT_REACTION_CONFIG: ReactionConfig = {
  message: "WAIT... YOU SAID YES?? 😭❤️",
  buttonText: "Let's pick a day",
};

export const DEFAULT_SCHEDULING_CONFIG: SchedulingConfig = {
  availableDays: [5, 6, 0],
  startHour: 17,
  endHour: 22,
  timezone: "UTC",
  dateRangeDays: 30,
};

export const DEFAULT_PREFERENCE_CONFIG: PreferenceConfig = {
  question: "What are we feeling?",
  options: [
    { emoji: "🍕", label: "Pizza" },
    { emoji: "🍣", label: "Sushi" },
    { emoji: "☕", label: "Coffee" },
    { emoji: "🎬", label: "Movie" },
    { emoji: "🌮", label: "Tacos" },
  ],
  multiSelect: false,
};

export const DEFAULT_CONFIRMATION_CONFIG: ConfirmationConfig = {
  message: "It's official ❤️",
  subMessage: "Get ready 😊",
};

export function withDefaults<T extends object>(value: unknown, defaults: T): T {
  if (!value || typeof value !== "object") return defaults;
  return { ...defaults, ...(value as Partial<T>) };
}

export type ThemeKey = "romantic-pink" | "ocean-blue" | "sunset-orange" | "lavender-dream" | "classic-red";

export type ThemeDefinition = {
  label: string;
  from: string;
  to: string;
  accent: string;
  accentHover: string;
  heading: string;
};

export const DEFAULT_THEME: ThemeKey = "romantic-pink";

export const THEMES: Record<ThemeKey, ThemeDefinition> = {
  "romantic-pink": { label: "Romantic pink", from: "#ffe4e6", to: "#fbcfe8", accent: "#f43f5e", accentHover: "#e11d48", heading: "#4c0519" },
  "ocean-blue": { label: "Ocean blue", from: "#e0f2fe", to: "#bae6fd", accent: "#0ea5e9", accentHover: "#0284c7", heading: "#082f49" },
  "sunset-orange": { label: "Sunset orange", from: "#ffedd5", to: "#fed7aa", accent: "#f97316", accentHover: "#ea580c", heading: "#431407" },
  "lavender-dream": { label: "Lavender dream", from: "#f3e8ff", to: "#e9d5ff", accent: "#a855f7", accentHover: "#9333ea", heading: "#3b0764" },
  "classic-red": { label: "Classic red", from: "#fee2e2", to: "#fecaca", accent: "#ef4444", accentHover: "#dc2626", heading: "#450a0a" },
};

export function getTheme(key: unknown): ThemeDefinition {
  return THEMES[key as ThemeKey] ?? THEMES[DEFAULT_THEME];
}
