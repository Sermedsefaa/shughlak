import { Role } from "@/lib/enums";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Link, redirect } from "@/navigation";
import { ApplicationRow } from "./application-row";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.user.role !== Role.EMPLOYER) {
    redirect("/");
  }

  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");

  const jobs = await prisma.jobListing.findMany({
    where: { employerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      applications: {
        include: {
          seeker: { include: { seekerProfile: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <Link
          href="/post-job"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          {tNav("postJob")}
        </Link>
      </div>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">{t("yourJobs")}</h2>
        {jobs.length === 0 ? (
          <p className="text-slate-600">
            {t("emptyList")}{" "}
            <Link href="/post-job" className="font-semibold text-primary">
              {t("createFirst")}
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-6">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {job.location} · {job.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-800">
                    {t("applicants")}
                  </h4>
                  {job.applications.length === 0 ? (
                    <p className="text-sm text-slate-500">{t("noApplicants")}</p>
                  ) : (
                    <ul className="space-y-2">
                      {job.applications.map((a) => (
                        <ApplicationRow
                          key={a.id}
                          application={a}
                          locale={locale}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
