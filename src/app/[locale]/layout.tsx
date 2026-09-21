import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HtmlLangSync } from "@/components/site/html-lang-sync";
import { ConsultProvider } from "@/components/consult/consult-provider";
import { ConsultWidget } from "@/components/consult/consult-widget";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === routing.defaultLocale ? "/" : `/${l}`])
      ),
    },
    ...(locale === "en"
      ? {
          title: { default: "THE GRAND", template: "%s · THE GRAND" },
          description:
            "THE GRAND — premium travel, hotel & vehicle reservation experience.",
        }
      : {
          title: { default: "더 그랜드", template: "%s · 더 그랜드" },
          description: "더 그랜드 — 프리미엄 여행, 호텔·차량 예약 경험.",
        }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangSync locale={locale} />
      <ConsultProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <ConsultWidget />
      </ConsultProvider>
    </NextIntlClientProvider>
  );
}
