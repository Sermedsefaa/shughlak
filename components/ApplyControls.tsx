"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useState } from "react";

export function ApplyControls({
  jobId,
  initialApplied,
  allowApply = true,
}: {
  jobId: string;
  initialApplied: boolean;
  /** When false (e.g. DIRECT_ONLY listing), hide in-app apply */
  allowApply?: boolean;
}) {
  const t = useTranslations("jobDetail");
  const session = useSession();
  const router = useRouter();
  const [applied, setApplied] = useState(initialApplied);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSeeker = session.data?.user.role === "SEEKER";

  const onApply = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? "Error");
        return;
      }
      setApplied(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!allowApply) {
    return (
      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-center text-sm text-app-muted ring-1 ring-slate-100">
        {t("directOnlyApplyHint")}
      </p>
    );
  }

  if (!session.data) {
    return (
      <p className="rounded-2xl bg-app-surface px-4 py-3 text-center text-sm text-app-muted ring-1 ring-slate-100">
        {t("loginToApply")}
      </p>
    );
  }

  if (!isSeeker) {
    return (
      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 ring-1 ring-amber-100">
        {t("employerHint")}
      </p>
    );
  }

  if (applied) {
    return (
      <p className="rounded-2xl bg-primary-light px-4 py-4 text-center text-sm font-semibold text-primary ring-1 ring-primary/20">
        {t("applied")}
      </p>
    );
  }

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={onApply}
        disabled={loading}
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white active:bg-primary-dark disabled:opacity-60"
      >
        {loading ? "…" : t("apply")}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
