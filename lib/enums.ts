/** SQLite + Prisma: no native enums; store as string, use these for type-safety. */

export const Role = {
  SEEKER: "SEEKER",
  EMPLOYER: "EMPLOYER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const JobType = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
} as const;
export type JobType = (typeof JobType)[keyof typeof JobType];

export const ApplicationStatus = {
  PENDING: "PENDING",
  VIEWED: "VIEWED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;
export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const APPLICATION_STATUS_LIST = Object.values(ApplicationStatus);
export const JOB_TYPE_LIST = Object.values(JobType);

/** How candidates should reach the employer for this listing */
export const ContactPreference = {
  BOTH: "BOTH",
  DIRECT_ONLY: "DIRECT_ONLY",
  PLATFORM_ONLY: "PLATFORM_ONLY",
} as const;
export type ContactPreference =
  (typeof ContactPreference)[keyof typeof ContactPreference];

export const CONTACT_PREFERENCE_LIST = Object.values(ContactPreference);
