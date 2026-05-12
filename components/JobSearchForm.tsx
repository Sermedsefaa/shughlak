"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/navigation";

export function JobSearchForm({
  placeholder,
  searchLabel,
  name = "q",
}: {
  placeholder: string;
  searchLabel: string;
  name?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const value = (fd.get(name) as string)?.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname || "/");
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full min-w-0">
      <Search
        className="pointer-events-none absolute start-3.5 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-app-muted sm:h-5 sm:w-5"
        strokeWidth={2}
        aria-hidden
      />
      <input
        type="search"
        name={name}
        defaultValue={searchParams.get(name) ?? ""}
        placeholder={placeholder}
        className="w-full min-w-0 rounded-2xl border-0 bg-app-surface py-3.5 ps-11 pe-14 text-[15px] text-app-ink shadow-[0_1px_3px_rgba(15,23,42,0.06)] outline-none ring-1 ring-slate-200/90 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/45 sm:ps-12 sm:pe-28 sm:text-base"
        autoComplete="off"
        enterKeyHint="search"
      />
      <button
        type="submit"
        className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-white shadow-sm active:bg-primary-dark sm:h-10 sm:w-auto sm:min-w-[5.5rem] sm:px-4"
        aria-label={searchLabel}
      >
        <Search className="h-[1.125rem] w-[1.125rem] sm:hidden" strokeWidth={2.5} aria-hidden />
        <span className="hidden text-sm font-semibold sm:inline">{searchLabel}</span>
      </button>
    </form>
  );
}
