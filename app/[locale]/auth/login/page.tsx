"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import { Link, useRouter } from "@/navigation";

function LoginForm() {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const password = fd.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(t("error"));
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{t("loginTitle")}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
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
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-primary/30 focus:ring-2"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "…" : t("submitLogin")}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600">
        {t("noAccount")}{" "}
        <Link href="/auth/register" className="font-semibold text-primary">
          {tNav("register")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}>
      <LoginForm />
    </Suspense>
  );
}
