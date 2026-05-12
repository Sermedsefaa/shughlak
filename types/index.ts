import type { EmployerProfile, JobListing, User } from "@prisma/client";

export type JobWithEmployer = JobListing & {
  employer: User & { employerProfile: EmployerProfile | null };
};
