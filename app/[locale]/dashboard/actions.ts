"use server";

import { Role } from "@/lib/enums";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationStatusSchema } from "@/lib/validators";

export async function updateApplicationStatus(
  _prev: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== Role.EMPLOYER) {
    return { error: "Unauthorized" };
  }

  const parsed = applicationStatusSchema.safeParse({
    applicationId: formData.get("applicationId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const { applicationId, status } = parsed.data;

  const existing = await prisma.application.findFirst({
    where: {
      id: applicationId,
      job: { employerId: session.user.id },
    },
  });
  if (!existing) {
    return { error: "Not found" };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
