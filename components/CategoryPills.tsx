import { ListFilter } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CategoryGlyph } from "@/components/CategoryGlyph";
import { JOB_CATEGORIES, type JobCategory } from "@/lib/categories";
import { Link } from "@/navigation";
import { cn } from "@/lib/cn";

export async function CategoryPills({
  activeCategory,
  basePath = "/",
  query,
  sectionLabel,
}: {
  activeCategory?: string;
  basePath?: "/" | "/jobs";
  query?: Record<string, string | undefined>;
  /** e.g. home.categoriesLabel — pass from parent for one less async getTranslations */
  sectionLabel?: string;
}) {
  const tJobs = await getTranslations("jobs");
  const label = sectionLabel ?? tJobs("category");

  const hrefFor = (cat: string | null) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v && k !== "category") params.set(k, v);
      });
    }
    if (cat) params.set("category", cat);
    const q = params.toString();
    if (basePath === "/jobs") return q ? `/jobs?${q}` : "/jobs";
    return q ? `/?${q}` : "/";
  };

  const pill = (active: boolean) =>
    cn(
      "inline-flex max-w-[min(100%,14rem)] shrink-0 snap-start items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium leading-tight transition-colors sm:max-w-none sm:px-3.5 sm:py-2 sm:text-sm",
      active
        ? "bg-primary text-white shadow-sm ring-1 ring-primary-dark/20"
        : "bg-app-surface text-app-ink ring-1 ring-slate-200/90 hover:bg-slate-50 active:bg-slate-100"
    );

  return (
    <section
      aria-labelledby="category-strip-heading"
      className="min-w-0 space-y-2.5"
    >
      <h2
        id="category-strip-heading"
        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-app-muted"
      >
        <ListFilter
          className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4"
          strokeWidth={2}
          aria-hidden
        />
        <span>{label}</span>
      </h2>

      {/* Mobile: horizontal scroll aligned with content, edge fades. sm+: wrap */}
      <div className="relative min-w-0">
        <div
          className="pointer-events-none absolute inset-y-0 start-0 z-[1] w-8 bg-gradient-to-r from-app-bg to-transparent sm:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 end-0 z-[1] w-8 bg-gradient-to-l from-app-bg to-transparent sm:hidden"
          aria-hidden
        />

        <div
          className={cn(
            "no-scrollbar flex min-w-0 touch-pan-x gap-2 overflow-x-auto overscroll-x-contain py-0.5",
            "scroll-ps-0 scroll-pe-0 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
            "sm:flex-wrap sm:overflow-x-visible sm:snap-none sm:py-0"
          )}
        >
          <Link
            href={hrefFor(null)}
            className={cn(pill(!activeCategory), "ps-2.5 pe-3 sm:ps-3")}
          >
            <CategoryGlyph
              category="all"
              className={cn(!activeCategory ? "text-white" : "text-primary")}
            />
            <span className="truncate">{tJobs("allCategories")}</span>
          </Link>
          {JOB_CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={hrefFor(cat)}
                className={cn(pill(active), "ps-2.5 pe-3 sm:ps-3")}
              >
                <CategoryGlyph
                  category={cat as JobCategory}
                  className={cn(active ? "text-white" : "text-primary")}
                />
                <span className="truncate">{cat}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
