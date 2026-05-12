import { Prisma } from "@prisma/client";

import { JobType } from "@/lib/enums";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CategoryPills } from "@/components/CategoryPills";
import { JobCard } from "@/components/JobCard";
import { JobSearchForm } from "@/components/JobSearchForm";
import { Link } from "@/navigation";
import { JOB_CATEGORIES } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const jobTypes: JobType[] = [JobType.FULL_TIME, JobType.PART_TIME];

export default async function JobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
    jobType?: string;
    salaryMin?: string;
    salaryMax?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const category = sp.category;
  const q = sp.q?.trim();
  const jobType =
    sp.jobType && jobTypes.includes(sp.jobType as JobType)
      ? (sp.jobType as JobType)
      : undefined;
  const salaryMin = sp.salaryMin ? Number(sp.salaryMin) : undefined;
  const salaryMax = sp.salaryMax ? Number(sp.salaryMax) : undefined;

  const t = await getTranslations("jobs");
  const tHome = await getTranslations("home");

  const validCategory =
    category && (JOB_CATEGORIES as readonly string[]).includes(category)
      ? category
      : undefined;

  const andFilters: Prisma.JobListingWhereInput[] = [];

  if (salaryMin != null && !Number.isNaN(salaryMin)) {
    andFilters.push({
      OR: [
        { salaryMin: { gte: salaryMin } },
        { salaryMax: { gte: salaryMin } },
      ],
    });
  }

  if (salaryMax != null && !Number.isNaN(salaryMax)) {
    andFilters.push({
      OR: [
        { salaryMin: { lte: salaryMax } },
        { salaryMax: { lte: salaryMax } },
      ],
    });
  }

  if (q) {
    andFilters.push({
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        {
          employer: {
            employerProfile: {
              is: { companyName: { contains: q } },
            },
          },
        },
      ],
    });
  }

  const whereClause: Prisma.JobListingWhereInput = {
    isActive: true,
    ...(validCategory ? { category: validCategory } : {}),
    ...(jobType ? { jobType } : {}),
    ...(andFilters.length ? { AND: andFilters } : {}),
  };

  const jobs = await prisma.jobListing.findMany({
    where: whereClause,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: {
      employer: { include: { employerProfile: true } },
    },
  });

  const queryForPills: Record<string, string | undefined> = {
    q: sp.q,
    jobType: sp.jobType,
    salaryMin: sp.salaryMin,
    salaryMax: sp.salaryMax,
  };

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="space-y-1.5">
        <h1 className="text-display-sm text-app-ink md:text-display">
          {t("title")}
        </h1>
        <p className="text-[15px] text-app-muted">{t("results", { count: jobs.length })}</p>
      </header>

      <Suspense
        fallback={<div className="h-[52px] rounded-2xl bg-app-surface shadow-sm ring-1 ring-slate-200/80" />}
      >
        <JobSearchForm
          placeholder={tHome("searchPlaceholder")}
          searchLabel={tHome("searchAction")}
        />
      </Suspense>

      <CategoryPills
        activeCategory={validCategory}
        basePath="/jobs"
        query={queryForPills}
        sectionLabel={tHome("categoriesLabel")}
      />

      <section className="rounded-2xl bg-app-surface p-4 ring-1 ring-slate-100">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          {t("filters")}
        </h2>
        <form className="grid gap-3 sm:grid-cols-2" method="get">
          <input type="hidden" name="q" value={sp.q ?? ""} />
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
            {t("jobType")}
            <select
              name="jobType"
              defaultValue={jobType ?? ""}
              className="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200"
            >
              <option value="">—</option>
              {jobTypes.map((jt) => (
                <option key={jt} value={jt}>
                  {jt === "FULL_TIME" ? t("fullTime") : t("partTime")}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
            {t("salaryMin")}
            <input
              type="number"
              name="salaryMin"
              defaultValue={sp.salaryMin ?? ""}
              min={0}
              className="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
            {t("salaryMax")}
            <input
              type="number"
              name="salaryMax"
              defaultValue={sp.salaryMax ?? ""}
              min={0}
              className="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
            {t("category")}
            <select
              name="category"
              defaultValue={validCategory ?? ""}
              className="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200"
            >
              <option value="">{t("allCategories")}</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white active:bg-primary-dark"
            >
              {t("filters")}
            </button>
            <Link
              href="/jobs"
              className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
            >
              {t("clear")}
            </Link>
          </div>
        </form>
      </section>

      <ul className="flex flex-col gap-3">
        {jobs.length === 0 ? (
          <li className="rounded-2xl bg-app-surface px-4 py-8 text-center text-[15px] text-app-muted ring-1 ring-slate-100">
            {t("empty")}
          </li>
        ) : (
          jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} locale={locale} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
