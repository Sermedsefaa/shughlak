"use client";

import type { SeekerProfile } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { updateSeekerProfile } from "./actions";

function SubmitButton() {
  const t = useTranslations("profile");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? "…" : t("save")}
    </button>
  );
}

export function ProfileForm({ profile }: { profile: SeekerProfile }) {
  const t = useTranslations("profile");
  const [state, formAction] = useFormState(updateSeekerProfile, {});

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="block space-y-1 text-sm">
        <span>{t("bio")}</span>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ""}
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{t("experienceYears")}</span>
        <input
          name="experienceYears"
          type="number"
          min={0}
          max={80}
          defaultValue={profile.experienceYears}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{t("skills")}</span>
        <input
          name="skills"
          defaultValue={profile.skills}
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{t("languages")}</span>
        <input
          name="languages"
          defaultValue={profile.languages}
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{t("cvUrl")}</span>
        <input
          name="cvUrl"
          type="url"
          defaultValue={profile.cvUrl ?? ""}
          placeholder="https://"
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-primary">{t("saved")}</p>
      )}
      <SubmitButton />
    </form>
  );
}
