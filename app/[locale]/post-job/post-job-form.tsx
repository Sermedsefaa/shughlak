"use client";

import { ContactPreference, JobType } from "@/lib/enums";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { JOB_CATEGORIES } from "@/lib/categories";

import { createJobListing } from "./actions";

function SubmitButton() {
  const t = useTranslations("postJob");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? "…" : t("submit")}
    </button>
  );
}

export function PostJobForm() {
  const t = useTranslations("postJob");
  const tJobs = useTranslations("jobs");
  const tType = useTranslations("jobTypeLabels");
  const [state, formAction] = useFormState(createJobListing, {});

  return (
    <form
      action={formAction}
      className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("fieldTitle")}</span>
        <input
          name="title"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{tJobs("category")}</span>
        <select
          name="category"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        >
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("fieldDescription")}</span>
        <textarea
          name="description"
          required
          minLength={10}
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("longDescription")}</span>
        <textarea
          name="longDescription"
          rows={8}
          placeholder="…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("coverImage")}</span>
        <input
          name="coverImageUrl"
          type="url"
          placeholder="https://…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("galleryUrls")}</span>
        <textarea
          name="galleryUrls"
          rows={4}
          placeholder="https://…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs outline-none ring-primary/30 focus:ring-2"
        />
      </label>

      <fieldset className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <legend className="text-sm font-semibold text-slate-800">
          {t("contactMode")}
        </legend>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="contactPreference"
            value={ContactPreference.BOTH}
            defaultChecked
            className="mt-1"
          />
          <span>{t("contactBoth")}</span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="contactPreference"
            value={ContactPreference.DIRECT_ONLY}
            className="mt-1"
          />
          <span>{t("contactDirect")}</span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="contactPreference"
            value={ContactPreference.PLATFORM_ONLY}
            className="mt-1"
          />
          <span>{t("contactPlatform")}</span>
        </label>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-700">{tJobs("salaryMin")}</span>
          <input
            name="salaryMin"
            type="number"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-700">{tJobs("salaryMax")}</span>
          <input
            name="salaryMax"
            type="number"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("fieldCurrency")}</span>
        <input
          name="currency"
          defaultValue="USD"
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{tJobs("jobType")}</span>
        <select
          name="jobType"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          defaultValue={JobType.FULL_TIME}
        >
          <option value={JobType.FULL_TIME}>
            {tType("FULL_TIME")}
          </option>
          <option value={JobType.PART_TIME}>
            {tType("PART_TIME")}
          </option>
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-700">{t("fieldLocation")}</span>
        <input
          name="location"
          defaultValue="Kirkuk"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-primary">{t("success")}</p>
      )}
      <SubmitButton />
    </form>
  );
}
