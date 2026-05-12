import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "ku", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
