"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { Link, useRouter } from "@/navigation";

type RoleChoice = "SEEKER" | "EMPLOYER";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const [role, setRole] = useState<RoleChoice>("SEEKER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      email: (fd.get("email") as string).trim(),
      password: fd.get("password") as string,
      fullName: (fd.get("fullName") as string).trim(),
      phone: (fd.get("phone") as string)?.trim() || undefined,
      role,
      companyName: (fd.get("companyName") as string)?.trim() || undefined,
      whatsapp: (fd.get("whatsapp") as string)?.trim() || undefined,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError(t("error"));
      setLoading(false);
      return;
    }

    const sign = await signIn("credentials", {
      email: body.email,
      password: body.password,
      redirect: false,
    });

    if (sign?.error) {
      setError(t("error"));
      setLoading(false);
      return;
    }

    if (role === "EMPLOYER") {
      router.push("/dashboard");
    } else {
      router.push("/profile");
    }
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{t("registerTitle")}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm text-slate-700">{t("role")}</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role_ui"
                checked={role === "SEEKER"}
                onChange={() => setRole("SEEKER")}
              />
              {t("seeker")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role_ui"
                checked={role === "EMPLOYER"}
                onChange={() => setRole("EMPLOYER")}
              />
              {t("employer")}
            </label>
          </div>
        </fieldset>

        <label className="block space-y-1 text-sm">
          <span className="text-slate-700">{t("fullName")}</span>
          <input
            name="fullName"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-700">{t("email")}</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
            autoComplete="email"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-700">{t("password")}</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
            autoComplete="new-password"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-700">{t("phone")}</span>
          <input
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
          />
        </label>

        {role === "EMPLOYER" && (
          <>
            <label className="block space-y-1 text-sm">
              <span className="text-slate-700">{t("companyName")}</span>
              <input
                name="companyName"
                required={role === "EMPLOYER"}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-slate-700">{t("whatsapp")}</span>
              <input
                name="whatsapp"
                type="tel"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
              />
            </label>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "…" : t("submitRegister")}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600">
        {t("hasAccount")}{" "}
        <Link href="/auth/login" className="font-semibold text-primary">
          {tNav("login")}
        </Link>
      </p>
    </div>
  );
}
