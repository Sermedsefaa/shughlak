import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CategoryPills } from "@/components/CategoryPills";
import { JobCard } from "@/components/JobCard";
import { JobSearchForm } from "@/components/JobSearchForm";
import { Link } from "@/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const category = sp.category;
  const q = sp.q?.trim();

  const t = await getTranslations("home");

  const whereClause = {
    isActive: true,
    ...(category ? { category } : {}),
    ...(q
      ? {
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
        }
      : {}),
  };

  const jobs = await prisma.jobListing.findMany({
    where: whereClause,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: {
      employer: { include: { employerProfile: true } },
    },
    take: 24,
  });

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="space-y-1.5">
        <h1 className="text-display-sm text-app-ink md:text-display">
          {t("title")}
        </h1>
        <p className="text-[15px] leading-snug text-app-muted md:text-base">
          {t("subtitle")}
        </p>
      </header>

      <Suspense
        fallback={<div className="h-[52px] rounded-2xl bg-app-surface shadow-sm ring-1 ring-slate-200/80" />}
      >
        <JobSearchForm
          placeholder={t("searchPlaceholder")}
          searchLabel={t("searchAction")}
        />
      </Suspense>

      <CategoryPills
        activeCategory={category}
        basePath="/"
        sectionLabel={t("categoriesLabel")}
      />

      <ul className="flex flex-col gap-3">
        {jobs.length === 0 ? (
          <li className="rounded-2xl bg-app-surface px-4 py-8 text-center text-[15px] text-app-muted ring-1 ring-slate-100">
            {t("noResults")}
          </li>
        ) : (
          jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} locale={locale} />
            </li>
          ))
        )}
      </ul>

      <div className="flex justify-center pb-2">
        <Link
          href="/jobs"
          className="text-[15px] font-semibold text-primary hover:text-primary-dark hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>
    </div>
  );
}
