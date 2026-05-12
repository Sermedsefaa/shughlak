"use server";

import { Role } from "@/lib/enums";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seekerProfileSchema } from "@/lib/validators";

export async function updateSeekerProfile(
  _prev: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== Role.SEEKER) {
    return { error: "Unauthorized" };
  }

  const raw = {
    bio: (formData.get("bio") as string) || undefined,
    experienceYears: formData.get("experienceYears") as string,
    skills: formData.get("skills") as string,
    languages: formData.get("languages") as string,
    cvUrl: (formData.get("cvUrl") as string) || "",
  };

  const parsed = seekerProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const data = parsed.data;
  await prisma.seekerProfile.update({
    where: { userId: session.user.id },
    data: {
      bio: data.bio || null,
      experienceYears: data.experienceYears,
      skills: data.skills,
      languages: data.languages,
      cvUrl: data.cvUrl || null,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
