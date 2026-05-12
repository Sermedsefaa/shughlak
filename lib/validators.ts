import { z } from "zod";
import { JOB_CATEGORIES, type JobCategory } from "./categories";
import { ContactPreference, JobType, Role } from "./enums";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum([Role.SEEKER, Role.EMPLOYER]),
  companyName: z.string().optional(),
  whatsapp: z.string().optional(),
});

export const postJobSchema = z.object({
  title: z.string().min(2),
  category: z
    .string()
    .refine((val): val is JobCategory =>
      (JOB_CATEGORIES as readonly string[]).includes(val)
    ),
  description: z.string().min(10),
  longDescription: z.preprocess(
    (v) => (typeof v === "string" && !String(v).trim() ? undefined : v),
    z.string().max(20000).optional()
  ),
  coverImageUrl: z.preprocess(
    (v) => (typeof v === "string" && !String(v).trim() ? undefined : v),
    z.string().url().optional()
  ),
  galleryUrls: z.preprocess(
    (v) => (typeof v === "string" && !String(v).trim() ? undefined : v),
    z.string().max(8000).optional()
  ),
  contactPreference: z.enum([
    ContactPreference.BOTH,
    ContactPreference.DIRECT_ONLY,
    ContactPreference.PLATFORM_ONLY,
  ]),
  salaryMin: z.coerce.number().int().nonnegative().optional(),
  salaryMax: z.coerce.number().int().nonnegative().optional(),
  currency: z.string().min(1).default("USD"),
  jobType: z.enum([JobType.FULL_TIME, JobType.PART_TIME]),
  location: z.string().min(1),
});

export const seekerProfileSchema = z.object({
  bio: z.string().optional(),
  experienceYears: z.coerce.number().int().min(0).max(80),
  skills: z.string().min(1),
  languages: z.string().min(1),
  cvUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export const applicationStatusSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["PENDING", "VIEWED", "ACCEPTED", "REJECTED"]),
});
