"use client";

import type { Application, User, SeekerProfile } from "@prisma/client";

import { APPLICATION_STATUS_LIST } from "@/lib/enums";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { formatDate } from "@/lib/format";

import { updateApplicationStatus } from "./actions";

function SubmitStatus() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
    >
      {pending ? "…" : "OK"}
    </button>
  );
}

type ApplicationRowProps = {
  application: Application & {
    seeker: User & { seekerProfile: SeekerProfile | null };
  };
  locale: string;
};

export function ApplicationRow({ application, locale }: ApplicationRowProps) {
  const ta = useTranslations("applicationStatus");
  const [state, formAction] = useFormState(updateApplicationStatus, {});

  const name =
    application.seeker.fullName ||
    application.seeker.seekerProfile?.skills ||
    "—";
  const when = formatDate(application.createdAt, locale);

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">
          {application.seeker.email} · {when}
        </p>
      </div>
      <form
        action={formAction}
        className="flex flex-wrap items-center gap-2"
      >
        <input type="hidden" name="applicationId" value={application.id} />
        <select
          name="status"
          defaultValue={application.status}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm"
        >
          {APPLICATION_STATUS_LIST.map((s) => (
            <option key={s} value={s}>
              {ta(s)}
            </option>
          ))}
        </select>
        <SubmitStatus />
      </form>
      {state?.error && (
        <p className="text-xs text-red-600 sm:w-full">{state.error}</p>
      )}
    </li>
  );
}
