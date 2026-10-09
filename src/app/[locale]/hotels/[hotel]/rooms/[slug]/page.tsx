import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { BedDouble, Check, Clock, Eye, Ruler, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { RoomCard } from "@/components/hotels/room-card";
import { RoomGallery } from "@/components/hotels/room-gallery";
import { RoomRateCalculator } from "@/components/hotels/room-rate-calculator";
import { RoomPrice } from "@/components/pricing/room-price";
import {
  getHotel,
  getRoom,
  groupAmenities,
  hotelImageSrc,
  pickText,
} from "@/data/hotels";
import { buildHotelOptions } from "@/data/hotels/hotel-options";
import { parseIsoDate } from "@/lib/pricing";
import { getRateBook } from "@/lib/rates";

export const dynamic = "force-dynamic";

const validDate = (v: string | undefined) => (v && parseIsoDate(v) !== null ? v : "");

type RouteParams = { locale: string; hotel: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, hotel: hotelId, slug } = await params;
  const hotel = getHotel(hotelId);
  const room = hotel && getRoom(hotel, slug);
  if (!hotel || !room) return {};
  return {
    title: `${room.name} · ${hotel.name}`,
    description: pickText(room.description, locale),
  };
}

const OTHER_ROOMS_COUNT = 3;

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; rate?: string }>;
}) {
  const { locale, hotel: hotelId, slug } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const hotel = getHotel(hotelId);
  const room = hotel && getRoom(hotel, slug);
  if (!hotel || !room) notFound();

  const t = await getTranslations({ locale, namespace: "hotels" });
  const book = await getRateBook();
  const option = buildHotelOptions(locale, book).find((h) => h.id === hotel.id)!;
  const roomOption = option.rooms.find((r) => r.slug === room.slug)!;
  const amenities = groupAmenities(room, locale);
  const category = hotel.categories.find((c) => c.key === room.category);

  const specs: { icon: ComponentType<{ size?: number; className?: string }>; label: string; value: string }[] = [
    { icon: Ruler, label: t("specSize"), value: room.size },
    { icon: Users, label: t("specGuests"), value: pickText(room.guests, locale) },
  ];
  if (room.beds) {
    specs.push({ icon: BedDouble, label: t("specBeds"), value: pickText(room.beds, locale) });
  }
  if (room.bedrooms) {
    specs.push({ icon: BedDouble, label: t("specBedrooms"), value: pickText(room.bedrooms, locale) });
  }
  specs.push({ icon: Eye, label: t("specView"), value: pickText(room.view, locale) });
  if (hotel.checkIn && hotel.checkOut) {
    specs.push({
      icon: Clock,
      label: `${t("checkIn")} / ${t("checkOut")}`,
      value: `${hotel.checkIn} / ${hotel.checkOut}`,
    });
  }

  const sameCategory = hotel.rooms.filter(
    (r) => r.slug !== room.slug && r.category === room.category
  );
  const rest = hotel.rooms.filter(
    (r) => r.slug !== room.slug && r.category !== room.category
  );
  const otherRooms = [...sameCategory, ...rest].slice(0, OTHER_ROOMS_COUNT);

  const amenityGroups = [
    { key: "facilities", title: t("facilitiesTitle"), items: amenities.facilities },
    { key: "equipment", title: t("equipmentTitle"), items: amenities.equipment },
  ].filter((g) => g.items.length > 0);

  return (
    <Container className="py-16 sm:py-24">
      <Reveal>
        <Link
          href={`/hotels/${hotel.id}`}
          className="text-sm text-fg-muted transition-colors hover:text-fg"
        >
          ← {hotel.name}
        </Link>
      </Reveal>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
        <Reveal delay={0.05}>
          <RoomGallery
            images={room.images.map(hotelImageSrc)}
            name={room.name}
          />
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col">
          {category && (
            <p className="text-xs uppercase tracking-wide text-accent">
              {pickText(category.label, locale)}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold text-fg sm:text-4xl">
            {room.name}
          </h1>
          <p className="mt-5 break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
            {pickText(room.description, locale)}
          </p>

          <dl className="mt-8 grid gap-4 border-t border-border pt-6">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <dt className="text-xs text-fg-subtle">{label}</dt>
                  <dd className="mt-0.5 text-sm text-fg">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <RoomRateCalculator
            hotelId={hotel.id}
            roomSlug={room.slug}
            variants={roomOption.variants}
            holidays={book.holidays}
            info={option.info}
            initialCheckIn={validDate(query.checkIn)}
            initialCheckOut={validDate(query.checkOut)}
            initialRateKey={query.rate ?? ""}
          />
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <h2 className="text-2xl font-semibold text-fg">{t("amenitiesTitle")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {amenityGroups.map((group) => (
            <div
              key={group.key}
              className="rounded-2xl border border-border bg-bg-elevated p-6"
            >
              <h3 className="text-sm font-semibold text-fg">{group.title}</h3>
              <ul className="mt-4 grid gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-fg-muted"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      {otherRooms.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-fg">{t("otherRooms")}</h2>
          <RevealGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherRooms.map((other) => {
              const otherOption = option.rooms.find((r) => r.slug === other.slug)!;
              return (
                <RevealItem key={other.slug}>
                  <RoomCard
                    href={`/hotels/${hotel.id}/rooms/${other.slug}`}
                    name={other.name}
                    thumb={otherOption.thumb}
                    summary={otherOption.summary}
                    price={
                      <RoomPrice
                        variants={otherOption.variants}
                        holidays={book.holidays}
                        info={option.info}
                      />
                    }
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      )}

      <p className="mt-14 break-keep text-xs leading-relaxed text-fg-subtle">
        {t("disclaimer")}
      </p>
    </Container>
  );
}
