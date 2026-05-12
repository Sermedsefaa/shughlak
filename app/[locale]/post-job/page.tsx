import { Role } from "@/lib/enums";
import { getTranslations } from "next-intl/server";

import { getSession } from "@/lib/get-session";
import { redirect } from "@/navigation";
import { PostJobForm } from "./post-job-form";

export const dynamic = "force-dynamic";

export default async function PostJobPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.user.role !== Role.EMPLOYER) {
    redirect("/");
  }

  const t = await getTranslations("postJob");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <PostJobForm />
    </div>
  );
}
