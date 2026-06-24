import { z } from "zod";

export const usernamePattern = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Za-z]/, "Use at least 8 characters with a letter, a number, and a symbol")
  .regex(/\d/, "Use at least 8 characters with a letter, a number, and a symbol")
  .regex(/[^A-Za-z0-9]/, "Use at least 8 characters with a letter, a number, and a symbol");

export const signupSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  username: z
    .string()
    .toLowerCase()
    .regex(usernamePattern, "Use 3-32 lowercase letters, numbers, or hyphens"),
  firstName: z.string().min(1).max(60),
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
  domain: z.string().toLowerCase().regex(domainPattern, "Enter a valid domain, e.g. yourname.com"),
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
