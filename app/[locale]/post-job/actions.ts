"use server";

import { Role } from "@/lib/enums";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { JOB_CATEGORIES } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { postJobSchema } from "@/lib/validators";

export async function createJobListing(
  _prev: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== Role.EMPLOYER) {
    return { error: "Unauthorized" };
  }

  const categoryRaw = formData.get("category") as string;
  if (!JOB_CATEGORIES.includes(categoryRaw as (typeof JOB_CATEGORIES)[number])) {
    return { error: "Invalid category" };
  }

  const salaryMinRaw = (formData.get("salaryMin") as string)?.trim();
  const salaryMaxRaw = (formData.get("salaryMax") as string)?.trim();
  const longDesc = (formData.get("longDescription") as string)?.trim();
  const coverRaw = (formData.get("coverImageUrl") as string)?.trim();
  const galleryRaw = (formData.get("galleryUrls") as string)?.trim();

  const raw = {
    title: formData.get("title") as string,
    category: categoryRaw,
    description: formData.get("description") as string,
    longDescription: longDesc || undefined,
    coverImageUrl: coverRaw || undefined,
    galleryUrls: galleryRaw || undefined,
    contactPreference: (formData.get("contactPreference") as string) || "BOTH",
    salaryMin:
      salaryMinRaw !== undefined && salaryMinRaw !== ""
        ? Number(salaryMinRaw)
        : undefined,
    salaryMax:
      salaryMaxRaw !== undefined && salaryMaxRaw !== ""
        ? Number(salaryMaxRaw)
        : undefined,
    currency: (formData.get("currency") as string) || "USD",
    jobType: formData.get("jobType") as string,
    location: formData.get("location") as string,
  };

  const parsed = postJobSchema.safeParse({
    ...raw,
    coverImageUrl: coverRaw === "" ? "" : coverRaw || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const data = parsed.data;

  await prisma.jobListing.create({
    data: {
      employerId: session.user.id,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      longDescription: data.longDescription?.trim() || null,
      coverImageUrl: data.coverImageUrl?.trim() || null,
      galleryUrls: data.galleryUrls?.trim() || null,
      contactPreference: data.contactPreference,
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
      currency: data.currency,
      jobType: data.jobType,
      location: data.location.trim(),
      isActive: true,
      isFeatured: false,
    },
  });

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { ok: true };
}
