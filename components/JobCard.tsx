import type { JobListing, User, EmployerProfile } from "@prisma/client";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ContactPreference } from "@/lib/enums";
import { Link } from "@/navigation";
import { formatDate, formatSalaryRange } from "@/lib/format";
import { toTelHref } from "@/lib/phone";
import { toWhatsAppDigits } from "@/lib/whatsapp";

type JobWithEmployer = JobListing & {
  employer: User & { employerProfile: EmployerProfile | null };
};

export async function JobCard({
  job,
  locale,
}: {
  job: JobWithEmployer;
  locale: string;
}) {
  const t = await getTranslations("jobCard");
  const tType = await getTranslations("jobTypeLabels");

  const company = job.employer.employerProfile?.companyName ?? "Employer";
  const wa = toWhatsAppDigits(job.employer.employerProfile?.whatsapp);
  const tel = toTelHref(job.employer.phone);
  const pref =
    (job.contactPreference as ContactPreference) ?? ContactPreference.BOTH;
  const showWaOnCard =
    !!wa &&
    (pref === ContactPreference.BOTH ||
      pref === ContactPreference.DIRECT_ONLY);
  const showTelOnCard =
    !!tel &&
    (pref === ContactPreference.BOTH ||
      pref === ContactPreference.DIRECT_ONLY);

  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? formatSalaryRange(job.salaryMin, job.salaryMax, job.currency, locale)
      : t("salaryOpen");
  const posted = formatDate(job.createdAt, locale);

  return (
    <article
      className={[
        "relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-app-surface p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]",
        job.isFeatured ? "ring-2 ring-primary/30" : "ring-1 ring-slate-100",
      ].join(" ")}
    >
      <Link
        href={`/jobs/${job.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`${t("openDetail")}: ${job.title}`}
      />

      {job.isFeatured && (
        <p className="relative z-10 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary pointer-events-none">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
          {t("featured")}
        </p>
      )}

      <div className="relative z-10 min-w-0 space-y-2 pointer-events-none">
        <h2 className="text-[17px] font-bold leading-snug text-app-ink md:text-lg">
          {job.title}
        </h2>
        <p className="flex flex-wrap items-center gap-x-1.5 text-[15px] text-app-muted">
          <span className="truncate">{company}</span>
          {job.employer.isVerified && (
            <span className="inline-flex shrink-0 items-center gap-0.5 text-primary" title={t("verified")}>
              <BadgeCheck className="h-4 w-4" strokeWidth={2} aria-hidden />
              <span className="sr-only">{t("verified")}</span>
            </span>
          )}
        </p>
        <p className="line-clamp-2 text-[14px] leading-snug text-app-muted">
          {job.description}
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 text-[14px] text-app-muted pointer-events-none">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-app-ink">
          {tType(job.jobType)}
        </span>
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80" strokeWidth={2} aria-hidden />
          <span className="truncate">{job.location}</span>
        </span>
      </div>

      <p className="relative z-10 text-lg font-bold text-primary md:text-xl pointer-events-none">
        {salary}
      </p>
      <p className="relative z-10 inline-flex items-center gap-1.5 text-xs text-slate-400 pointer-events-none">
        <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        {t("posted", { date: posted })}
      </p>

      <div className="relative z-20 mt-1 flex flex-col gap-2 border-t border-slate-100 pt-3">
        <Link
          href={`/jobs/${job.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center text-[15px] font-semibold text-white shadow-sm active:bg-primary-dark"
        >
          {t("openDetail")}
          <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
        </Link>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {showTelOnCard && tel && (
            <a
              href={tel}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-app-surface py-3 text-center text-[15px] font-semibold text-app-ink ring-1 ring-slate-100 active:bg-slate-50"
            >
              <Phone className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
              {t("callEmployer")}
            </a>
          )}
          {showWaOnCard && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-app-surface py-3 text-center text-[15px] font-semibold text-app-ink ring-1 ring-slate-100 active:bg-slate-50"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" strokeWidth={2} aria-hidden />
              {t("whatsapp")}
            </a>
          )}
        </div>
        {pref === ContactPreference.PLATFORM_ONLY && (
          <p className="text-center text-[12px] text-app-muted">
            <ArrowRight className="me-1 inline h-3.5 w-3.5 align-text-bottom" aria-hidden />
            {t("platformOnlyHint")}
          </p>
        )}
      </div>
    </article>
  );
}
