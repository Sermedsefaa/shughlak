"use client";

import { Briefcase, Globe, LogOut, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { Link, usePathname, useRouter } from "@/navigation";
import { routing } from "@/routing";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const session = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const sessionHref =
    session.data?.user.role === "EMPLOYER"
      ? "/dashboard"
      : session.data?.user.role === "SEEKER"
        ? "/profile"
        : "/auth/login";

  const sessionLabel =
    session.data?.user.role === "EMPLOYER"
      ? t("dashboard")
      : session.data?.user.role === "SEEKER"
        ? t("profile")
        : t("login");

  const navLink = "inline-flex items-center gap-1.5 font-medium text-app-muted hover:text-primary";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-app-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex min-w-0 max-w-lg items-center justify-between gap-2 px-4 py-3 md:max-w-3xl md:px-6 lg:max-w-5xl">
        <Link href="/" className="min-w-0 flex-1">
          <span className="block truncate text-lg font-bold tracking-tight text-app-ink md:text-xl">
            {tb("name")}
          </span>
          <span className="block truncate text-[13px] text-app-muted md:text-sm">
            {tb("tagline")}
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-4 text-sm md:flex">
          <Link href="/jobs" className={navLink}>
            <Briefcase className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {t("jobs")}
          </Link>
          {session.status === "authenticated" ? (
            <>
              <Link href={sessionHref} className={navLink}>
                <User className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                {sessionLabel}
              </Link>
              {session.data?.user.role === "EMPLOYER" && (
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
                >
                  <Briefcase className="h-4 w-4" strokeWidth={2} aria-hidden />
                  {t("postJob")}
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={cn(navLink, "border-0 bg-transparent p-0")}
              >
                <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                {t("logout")}
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              <User className="h-4 w-4" strokeWidth={2} aria-hidden />
              {t("login")}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <Globe
            className="hidden h-4 w-4 text-app-muted sm:block"
            strokeWidth={2}
            aria-hidden
          />
          <label className="sr-only" htmlFor="lang-switch">
            Language
          </label>
          <select
            id="lang-switch"
            className="max-w-[4.5rem] rounded-xl border-0 bg-slate-100/90 py-2 pe-2 ps-2 text-xs font-semibold text-app-ink outline-none ring-1 ring-slate-200/80 focus:ring-2 focus:ring-primary/35"
            value={locale}
            onChange={(e) => {
              router.replace(pathname || "/", { locale: e.target.value });
            }}
          >
            {routing.locales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
