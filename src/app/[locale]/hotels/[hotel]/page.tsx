import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/button";
import { HotelRoomBrowser } from "@/components/hotels/hotel-room-browser";
import { getHotel, hotelImageSrc, pickText } from "@/data/hotels";
import { buildHotelOptions } from "@/data/hotels/hotel-options";
import { getPublicRateBook } from "@/lib/rates";
import { JsonLd } from "@/components/seo/json-ld";
import { absUrl, breadcrumbLd, clip, HOTEL_KO_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; hotel: string }>;
}) {
  const { locale, hotel: hotelId } = await params;
  const hotel = getHotel(hotelId);
  if (!hotel) return {};
  const koName = HOTEL_KO_NAME[hotel.id] ?? hotel.name;
  return {
    title: `${koName} 객실·시설 안내`,
    description: clip(
      `${koName} 객실 ${hotel.rooms.length}종과 시설 안내. ${pickText(hotel.tagline, locale)}. 호짬 호텔 예약과 객실 문의는 카카오톡으로 편하게 남겨 주세요.`,
      150
    ),
    alternates: { canonical: `/hotels/${hotel.id}` },
  };
}

export default async function HotelPage({
  params,
}: {
  params: Promise<{ locale: string; hotel: string }>;
}) {
  const { locale, hotel: hotelId } = await params;
  setRequestLocale(locale);
  const hotel = getHotel(hotelId);
  if (!hotel) notFound();

  const t = await getTranslations({ locale, namespace: "hotels" });
  const book = await getPublicRateBook();
  const option = buildHotelOptions(locale, book).find((h) => h.id === hotel.id)!;
  const koName = HOTEL_KO_NAME[hotel.id] ?? hotel.name;

  return (
    <Container className="py-16 sm:py-24">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Hotel",
            name: koName,
            alternateName: hotel.name,
            description: pickText(hotel.description, locale),
            image: absUrl(hotelImageSrc(hotel.cover)),
            url: absUrl(`/hotels/${hotel.id}`),
            address: { "@type": "PostalAddress", addressLocality: "Ho Tram", addressCountry: "VN" },
            ...(hotel.checkIn ? { checkinTime: hotel.checkIn } : {}),
            ...(hotel.checkOut ? { checkoutTime: hotel.checkOut } : {}),
            numberOfRooms: hotel.rooms.length,
          },
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "호텔", path: "/hotels" },
            { name: koName, path: `/hotels/${hotel.id}` },
          ]),
        ]}
      />
      <Reveal>
        <Link
          href="/hotels"
          className="text-sm text-fg-muted transition-colors hover:text-fg"
        >
          ← {t("backToHotels")}
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-bg-elevated-2 sm:aspect-[21/9]">
          <Image
            src={hotelImageSrc(hotel.cover)}
            alt={hotel.name}
            fill
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </Reveal>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-wide text-accent">
            {pickText(hotel.tagline, locale)}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-fg sm:text-4xl">
            {hotel.name}
          </h1>
          <p className="mt-5 break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
            {pickText(hotel.description, locale)}
          </p>
          {hotel.checkIn && hotel.checkOut && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-fg-muted">
              <Clock size={16} className="text-accent" />
              {t("checkIn")} {hotel.checkIn} · {t("checkOut")} {hotel.checkOut}
            </p>
          )}
        </div>

        <LinkButton
          href={`/inquiry?source=${encodeURIComponent(`hotel:${hotel.id}`)}`}
          size="lg"
          className="shrink-0"
        >
          {t("reserveCta")}
        </LinkButton>
      </div>

      <div className="mt-16">
        <HotelRoomBrowser
          hotel={option}
          holidays={book.holidays}
        />
      </div>

      <p className="mt-14 break-keep text-xs leading-relaxed text-fg-subtle">
        {t("disclaimer")}
      </p>
    </Container>
  );
}
