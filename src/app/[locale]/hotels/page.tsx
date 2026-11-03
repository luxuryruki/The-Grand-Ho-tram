import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HotelCard } from "@/components/hotels/hotel-card";
import { MemberNotice } from "@/components/membership/member-notice";
import { PriceDisclaimer } from "@/components/pricing/price-disclaimer";
import { HOTELS } from "@/data/hotels";
import { PRICES_VISIBLE } from "@/lib/features";
import { JsonLd } from "@/components/seo/json-ld";
import { absUrl, HOTEL_KO_NAME } from "@/lib/seo";
import { getPublicRateBook } from "@/lib/rates";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return {
    title: "호짬 호텔 예약 · 객실 비교",
    description:
      "호짬 리조트의 인터컨티넨탈 그랜드 호짬, 홀리데이 인 리조트 호짬 비치, 익소라 호짬. 세 호텔의 객실 종류와 시설을 한눈에 비교하고 호텔 예약 문의는 카카오톡으로 남겨 주세요.",
    alternates: { canonical: "/hotels" },
  };
}

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "hotels" });
  const book = await getPublicRateBook();

  const fromPrice = (hotelId: string) => {
    const weekdays = book.rates
      .filter((r) => r.hotelId === hotelId && r.roomSlugs.length > 0)
      .map((r) => r.weekday);
    return weekdays.length ? Math.min(...weekdays) : null;
  };

  return (
    <Container className="py-16 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "호짬 호텔 목록",
          itemListElement: HOTELS.map((h, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: HOTEL_KO_NAME[h.id] ?? h.name,
            url: absUrl(`/hotels/${h.id}`),
          })),
        }}
      />
      <Reveal>
        <h1 className="text-3xl font-semibold text-fg sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 max-w-xl break-keep text-sm text-fg-muted sm:text-base">
          {t("pageSubtitle")}
        </p>
      </Reveal>

      <MemberNotice className="mt-8 max-w-3xl" />

      <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HOTELS.map((hotel) => (
          <RevealItem key={hotel.id}>
            <HotelCard hotel={hotel} locale={locale} fromPrice={fromPrice(hotel.id)} />
          </RevealItem>
        ))}
      </RevealGroup>

      {PRICES_VISIBLE && <PriceDisclaimer className="mt-10" />}
    </Container>
  );
}
