import { Role } from "@/lib/enums";
import { getTranslations } from "next-intl/server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/navigation";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.user.role !== Role.SEEKER) {
    redirect("/");
  }

  const profile = await prisma.seekerProfile.findUnique({
    where: { userId: session.user.id },
  });

  const t = await getTranslations("profile");

  if (!profile) {
    return <p className="text-slate-600">{t("title")}</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
