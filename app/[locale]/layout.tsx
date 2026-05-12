import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { routing } from "@/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div
          className="min-h-screen bg-app-bg pb-24 text-app-ink md:pb-8"
          dir={dir}
          lang={locale}
        >
          <Header />
          <main className="mx-auto w-full min-w-0 max-w-lg px-4 py-5 md:max-w-3xl md:px-6 md:py-8 lg:max-w-5xl">
            {children}
          </main>
          <BottomNav />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
