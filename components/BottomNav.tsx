"use client";

import { Briefcase, Home, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const t = useTranslations("nav");
  const session = useSession();
  const pathname = usePathname() || "/";

  const centerHref =
    session.data?.user.role === "EMPLOYER"
      ? "/dashboard"
      : session.data?.user.role === "SEEKER"
        ? "/profile"
        : "/auth/login";

  const centerLabel =
    session.data?.user.role === "EMPLOYER"
      ? t("dashboard")
      : session.data?.user.role === "SEEKER"
        ? t("profile")
        : t("login");

  const isHome = pathname === "/";
  const isJobs = pathname.startsWith("/jobs");
  const isCenter =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth");

  const item = (active: boolean) =>
    cn(
      "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-semibold leading-tight transition-colors",
      active ? "text-primary" : "text-app-muted hover:text-app-ink"
    );

  const iconWrap = (active: boolean) =>
    cn(
      "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
      active ? "bg-primary-light text-primary" : "bg-slate-100 text-app-muted"
    );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-app-surface/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm md:hidden">
      <div className="mx-auto flex min-w-0 max-w-lg px-1">
        <Link href="/" className={item(isHome)}>
          <span className={iconWrap(isHome)}>
            <Home className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          {t("home")}
        </Link>
        <Link href="/jobs" className={item(isJobs)}>
          <span className={iconWrap(isJobs)}>
            <Briefcase className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          {t("jobs")}
        </Link>
        <Link href={centerHref} className={item(isCenter)}>
          <span className={iconWrap(isCenter)}>
            <User className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="max-w-[5rem] text-center">{centerLabel}</span>
        </Link>
      </div>
    </nav>
  );
}
