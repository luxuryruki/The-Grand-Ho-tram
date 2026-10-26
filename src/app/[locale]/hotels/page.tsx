import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HotelCard } from "@/components/hotels/hotel-card";
import { MemberNotice } from "@/components/membership/member-notice";
import { PriceDisclaimer } from "@/components/pricing/price-disclaimer";
import { HOTELS } from "@/data/hotels";
import { PRICES_VISIBLE } from "@/lib/features";
import { getPublicRateBook } from "@/lib/rates";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotels" });
  return { title: t("pageTitle") };
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
