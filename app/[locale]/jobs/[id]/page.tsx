import { BadgeCheck, Clock, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApplyControls } from "@/components/ApplyControls";
import { ContactPreference } from "@/lib/enums";
import { formatDate, formatSalaryRange } from "@/lib/format";
import { mapsSearchUrl, parseGalleryUrls } from "@/lib/maps";
import { getSession } from "@/lib/get-session";
import { toTelHref } from "@/lib/phone";
import { Link } from "@/navigation";
import { prisma } from "@/lib/prisma";
import { toWhatsAppDigits } from "@/lib/whatsapp";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.jobListing.findFirst({
    where: { id, isActive: true },
    include: { employer: { include: { employerProfile: true } } },
  });
  if (!job) return {};
  const company =
    job.employer.employerProfile?.companyName ?? "Shughlak";
  return {
    title: `${job.title} — ${company}`,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations("jobDetail");
  const tCard = await getTranslations("jobCard");
  const tType = await getTranslations("jobTypeLabels");

  const job = await prisma.jobListing.findFirst({
    where: { id, isActive: true },
    include: { employer: { include: { employerProfile: true } } },
  });

  if (!job) notFound();

  const session = await getSession();
  let hasApplied = false;
  if (session?.user?.id && session.user.role === "SEEKER") {
    const existing = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId: job.id,
          seekerId: session.user.id,
        },
      },
    });
    hasApplied = !!existing;
  }

  const company =
    job.employer.employerProfile?.companyName ?? "Employer";
  const wa = toWhatsAppDigits(job.employer.employerProfile?.whatsapp);
  const tel = toTelHref(job.employer.phone);
  const pref =
    (job.contactPreference as ContactPreference) ?? ContactPreference.BOTH;

  const allowApply =
    pref === ContactPreference.BOTH || pref === ContactPreference.PLATFORM_ONLY;
  const showDirect =
    pref === ContactPreference.BOTH || pref === ContactPreference.DIRECT_ONLY;

  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? formatSalaryRange(job.salaryMin, job.salaryMax, job.currency, locale)
      : tCard("salaryOpen");
  const posted = formatDate(job.createdAt, locale);
  const mapQuery = `${job.location}, Kirkuk, Iraq`;
  const gallery = parseGalleryUrls(job.galleryUrls);

  return (
    <article className="mx-auto flex min-w-0 max-w-2xl flex-col gap-5 pb-28 md:max-w-3xl md:pb-10">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        ← {t("back")}
      </Link>

      {job.coverImageUrl && /^https?:\/\//i.test(job.coverImageUrl) && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.coverImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}

      <header
        className={[
          "rounded-2xl bg-app-surface p-5 ring-1 ring-slate-100",
          job.isFeatured ? "ring-2 ring-primary/30" : "",
        ].join(" ")}
      >
        {job.isFeatured && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            {tCard("featured")}
          </p>
        )}
        <h1 className="text-2xl font-bold leading-snug text-app-ink md:text-3xl">
          {job.title}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-lg text-app-muted">
          <span>{company}</span>
          {job.employer.isVerified && (
            <span className="inline-flex items-center gap-1 text-primary" title={tCard("verified")}>
              <BadgeCheck className="h-5 w-5" strokeWidth={2} aria-hidden />
              <span className="text-sm font-medium">{tCard("verified")}</span>
            </span>
          )}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-app-muted">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-app-ink">
            {tType(job.jobType)}
          </span>
          <span className="inline-flex items-center gap-1.5 self-center rounded-md bg-slate-50 px-2 py-1 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden />
            {job.location}
          </span>
        </div>

        <p className="mt-4 text-xl font-bold text-primary md:text-2xl">{salary}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-400">
          <Clock className="h-4 w-4" strokeWidth={2} aria-hidden />
          {tCard("posted", { date: posted })}
        </p>
      </header>

      <section className="rounded-2xl bg-app-surface p-5 ring-1 ring-slate-100">
        <h2 className="text-xs font-bold uppercase tracking-wider text-app-muted">
          {t("location")}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-app-ink">{job.location}</p>
        <a
          href={mapsSearchUrl(mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
          {t("openInMaps")}
          <ExternalLink className="h-3.5 w-3.5 opacity-90" strokeWidth={2} aria-hidden />
        </a>
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
          <iframe
            title={t("mapEmbedTitle")}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`}
          />
        </div>
      </section>

      <section className="rounded-2xl bg-app-surface p-5 ring-1 ring-slate-100">
        <h2 className="text-xs font-bold uppercase tracking-wider text-app-muted">
          {t("about")}
        </h2>
        <div className="mt-4 max-w-none">
          <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-app-ink">
            {job.description}
          </p>
        </div>
      </section>

      {job.longDescription?.trim() && (
        <section className="rounded-2xl bg-app-surface p-5 ring-1 ring-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-app-muted">
            {t("moreDetails")}
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-[16px] leading-relaxed text-app-ink">
            {job.longDescription}
          </p>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="rounded-2xl bg-app-surface p-5 ring-1 ring-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-app-muted">
            {t("gallery")}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {gallery.map((url) => (
              <li key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="sticky bottom-20 z-20 space-y-3 rounded-2xl border border-slate-200/80 bg-app-surface/95 p-4 shadow-lg backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <h2 className="sr-only">{t("actionsHeading")}</h2>
        {pref === ContactPreference.DIRECT_ONLY && (
          <p className="rounded-xl bg-primary-light px-3 py-2 text-center text-sm font-medium text-primary">
            {t("directOnlyBanner")}
          </p>
        )}
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          <ApplyControls
            jobId={job.id}
            initialApplied={hasApplied}
            allowApply={allowApply}
          />
          {showDirect && tel && (
            <a
              href={tel}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-app-surface py-3.5 text-sm font-semibold text-app-ink ring-1 ring-slate-100 md:w-auto md:min-w-[11rem]"
            >
              <Phone className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
              {tCard("callEmployer")}
            </a>
          )}
          {showDirect && wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-app-surface py-3.5 text-sm font-semibold text-app-ink ring-1 ring-slate-100 md:w-auto md:min-w-[11rem]"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" strokeWidth={2} aria-hidden />
              {tCard("whatsapp")}
            </a>
          )}
        </div>
      </section>
    </article>
  );
}
