/**
 * next-intl uses `ku`; many JS engines don't ship `ku` for Intl.
 * Map to BCP-47 tags that Intl accepts, then fall back to `en`.
 */
function intlLocaleTag(appLocale: string): string {
  const map: Record<string, string> = {
    ku: "ckb-IQ",
  };
  return map[appLocale] ?? appLocale;
}

function safeNumberFormat(locale: string, options: Intl.NumberFormatOptions) {
  const tag = intlLocaleTag(locale);
  try {
    return new Intl.NumberFormat(tag, options);
  } catch {
    return new Intl.NumberFormat("en", options);
  }
}

function safeDateFormat(locale: string, options: Intl.DateTimeFormatOptions) {
  const tag = intlLocaleTag(locale);
  try {
    return new Intl.DateTimeFormat(tag, options);
  } catch {
    return new Intl.DateTimeFormat("en", options);
  }
}

export function formatSalaryRange(
  min: number | null,
  max: number | null,
  currency: string,
  locale: string
): string {
  const fmt = safeNumberFormat(locale, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  });
  if (min != null && max != null) return `${fmt.format(min)} – ${fmt.format(max)}`;
  if (min != null) return fmt.format(min);
  if (max != null) return fmt.format(max);
  return "";
}

export function formatDate(value: Date, locale: string) {
  return safeDateFormat(locale, { dateStyle: "medium" }).format(value);
}
