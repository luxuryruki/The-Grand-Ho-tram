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
import { CONSULT_ENABLED, ENGLISH_ENABLED } from "@/lib/features";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const brand = isEn ? "The Concierge Ho Tram" : "더 컨시어지 호짬";
  const description = isEn
    ? "The Concierge Ho Tram — hotel, golf and travel inquiries for The Grand Ho Tram resort complex."
    : "더 컨시어지 호짬 — 더 그랜드 호짬 복합 리조트의 호텔·골프 안내와 문의.";
  const ogImage = { url: "/og/main.jpg", width: 1200, height: 630, alt: brand };
  return {
    // 카카오톡·SNS로 링크를 공유할 때 보이는 미리보기(제목, 설명, 대표 이미지)
    openGraph: {
      type: "website",
      siteName: brand,
      title: brand,
      description,
      locale: isEn ? "en_US" : "ko_KR",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: brand, description, images: [ogImage.url] },
    alternates: {
      languages: Object.fromEntries(
        routing.locales
          .filter((l) => ENGLISH_ENABLED || l === routing.defaultLocale)
          .map((l) => [l, l === routing.defaultLocale ? "/" : `/${l}`])
      ),
    },
    ...(locale === "en"
      ? {
          title: { default: "The Concierge Ho Tram", template: "%s · The Concierge Ho Tram" },
          description:
            "The Concierge Ho Tram — hotel, golf and travel inquiries for The Grand Ho Tram resort complex.",
        }
      : {
          title: { default: "더 컨시어지 호짬", template: "%s · 더 컨시어지 호짬" },
          description: "더 컨시어지 호짬 — 더 그랜드 호짬 복합 리조트의 호텔·골프 안내와 문의.",
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
        {CONSULT_ENABLED && <ConsultWidget />}
      </ConsultProvider>
    </NextIntlClientProvider>
  );
}
