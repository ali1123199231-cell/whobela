import { z } from "zod";
import { bareDomain } from "@/lib/custom-domain";

export const usernamePattern = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;

// Names under {name}.{ROOT_DOMAIN} that the platform itself needs, so a user
// must never be able to claim them. `connect` is load-bearing: it is the CNAME
// target every custom domain points at (see lib/custom-domain), and whoever
// held that username would own the hostname all of them depend on. The rest are
// conventional infrastructure names. Verified 2026-08-19: none are taken in
// production, so enforcing this breaks no existing account.
export const RESERVED_USERNAMES = new Set([
  "connect", "www", "api", "admin", "app", "mail", "smtp", "ftp",
  "support", "help", "status", "static", "cdn", "assets", "dev",
  "staging", "test", "blog", "docs", "billing", "account", "login",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.trim().toLowerCase());
}

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Za-z]/, "Use at least 8 characters with a letter, a number, and a symbol")
  .regex(/\d/, "Use at least 8 characters with a letter, a number, and a symbol")
  .regex(/[^A-Za-z0-9]/, "Use at least 8 characters with a letter, a number, and a symbol");

// First-touch acquisition attribution — best-effort, client-supplied, so keep
// it lenient: strip to a safe length and never fail signup over a bad value.
const attributionField = z.string().max(500).nullish().catch(null);

export const signupSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  username: z
    .string()
    .toLowerCase()
    .regex(usernamePattern, "Use 3-32 lowercase letters, numbers, or hyphens")
    .refine((u) => !isReservedUsername(u), "That username isn't available"),
  firstName: z.string().min(1).max(60),
  signupReferrer: attributionField,
  signupLandingPath: attributionField,
  utmSource: attributionField,
  utmMedium: attributionField,
  utmCampaign: attributionField,
  utmTerm: attributionField,
  utmContent: attributionField,
  gclid: attributionField,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  firstName: z.string().min(1).max(60),
  nickname: z.string().max(60).nullish(),
  age: z.number().int().min(13).max(120).nullish(),
  location: z.string().max(120).nullish(),
  occupation: z.string().max(120).nullish(),
  hobbies: z.string().max(500).nullish(),
  interests: z.string().max(500).nullish(),
  favoriteActivities: z.string().max(500).nullish(),
  personalityDescription: z.string().max(1000).nullish(),
  instagram: z.string().max(120).nullish(),
  tiktok: z.string().max(120).nullish(),
  facebook: z.string().max(120).nullish(),
  whatsapp: z.string().max(60).nullish(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export const changeEmailSchema = z.object({
  currentPassword: z.string().min(1),
  newEmail: z.string().email(),
});

export const deleteAccountSchema = z.object({
  usernameConfirmation: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  newPassword: passwordSchema,
});

export const domainPattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

export const connectDomainSchema = z.object({
  // Stored bare: "www.yourname.com" and "yourname.com" are the same connection,
  // and both are served (see lib/custom-domain).
  domain: z
    .string()
    .toLowerCase()
    .regex(domainPattern, "Enter a valid domain, e.g. yourname.com")
    .transform(bareDomain),
});

export const recipientContactSchema = z
  .object({
    instagram: z.string().max(120).optional().or(z.literal("")),
    whatsapp: z.string().max(60).optional().or(z.literal("")),
    facebook: z.string().max(120).optional().or(z.literal("")),
    phone: z.string().max(60).optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
  })
  .refine(
    (contact) => Object.values(contact).some((v) => typeof v === "string" && v.trim().length > 0),
    { message: "At least one contact method is required" }
  );

export const themeKeySchema = z.enum(["romantic-pink", "ocean-blue", "sunset-orange", "lavender-dream", "classic-red"]);

export const inviteConfigSchema = z.object({
  question: z.string().max(200),
  subtitle: z.string().max(200),
  emoji: z.string().max(16),
});

export const yesConfigSchema = z.object({
  buttonText: z.string().min(1).max(60),
  celebration: z.enum(["confetti", "hearts", "none"]),
});

export const noConfigSchema = z.object({
  enabled: z.boolean(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  messages: z.array(z.string().max(60)).min(1).max(10),
});

export const reactionConfigSchema = z.object({
  message: z.string().max(200),
  buttonText: z.string().min(1).max(60),
});

export const schedulingConfigSchema = z
  .object({
    availableDays: z.array(z.number().int().min(0).max(6)).min(1).max(7),
    startHour: z.number().int().min(0).max(23),
    endHour: z.number().int().min(0).max(23),
    timezone: z.string().min(1).max(60),
    dateRangeDays: z.number().int().min(1).max(365),
  })
  .refine((c) => c.endHour > c.startHour, { message: "endHour must be after startHour" });

export const preferenceConfigSchema = z.object({
  question: z.string().max(200),
  options: z.array(z.object({ emoji: z.string().max(16), label: z.string().min(1).max(60) })).max(10),
  multiSelect: z.boolean(),
});

export const confirmationConfigSchema = z.object({
  message: z.string().max(200),
  subMessage: z.string().max(200),
});

export const datePageUpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  theme: themeKeySchema.optional(),
  inviteConfig: inviteConfigSchema.optional(),
  yesConfig: yesConfigSchema.optional(),
  noConfig: noConfigSchema.optional(),
  reactionConfig: reactionConfigSchema.optional(),
  schedulingConfig: schedulingConfigSchema.optional(),
  preferenceConfig: preferenceConfigSchema.optional(),
  confirmationConfig: confirmationConfigSchema.optional(),
});

export const responseSubmitSchema = z.object({
  recipientName: z.string().min(1).max(120),
  recipientContact: recipientContactSchema,
  recipientMessage: z.string().max(500).optional().or(z.literal("")),
  recipientPhotoMediaId: z.string().uuid().optional(),
  preferenceSelections: z.array(z.string()).optional(),
  chosenDate: z.string().min(1),
  chosenTime: z.string().min(1),
  timezone: z.string().min(1),
});
