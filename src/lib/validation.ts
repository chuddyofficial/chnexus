import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export const mfaVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter a 6-digit code"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().max(200),
  message: z.string().trim().min(1).max(4000),
});

export const announcementSchema = z.object({
  message: z.string().trim().min(1).max(500),
  level: z.enum(["INFO", "WARNING", "CRITICAL"]),
  active: z.boolean(),
});

export const siteSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
});

export const submissionStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "ARCHIVED"]),
});
