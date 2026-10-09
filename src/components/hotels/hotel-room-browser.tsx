"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PriceDisclaimer } from "@/components/pricing/price-disclaimer";
import { RoomPrice } from "@/components/pricing/room-price";
import { StayDates } from "@/components/pricing/stay-dates";
import type { HotelOption } from "@/data/hotels/hotel-options";
import { parseIsoDate } from "@/lib/pricing";
import { RoomCard } from "./room-card";

/** 호텔 페이지의 객실 목록. 체크인·체크아웃을 고르면 모든 객실 카드에 그 기간의 요금이 바로 계산되어 표시됩니다. */
export function HotelRoomBrowser({
  hotel,
  holidays,
  initialCheckIn,
  initialCheckOut,
}: {
  hotel: HotelOption;
  holidays: string[];
  initialCheckIn: string;
  initialCheckOut: string;
}) {
  const t = useTranslations("hotels");
  const p = useTranslations("pricing");
  const [dates, setDates] = useState({ checkIn: initialCheckIn, checkOut: initialCheckOut });

  const datesQuery =
    parseIsoDate(dates.checkIn) !== null && parseIsoDate(dates.checkOut) !== null
      ? `?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
      : "";

  return (
    <div>
      <div className="rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-fg">{p("datesTitle")}</h3>
        <div className="mt-3 max-w-md">
          <StayDates
            checkIn={dates.checkIn}
            checkOut={dates.checkOut}
            min={hotel.info?.validFrom}
            onChange={setDates}
          />
        </div>
        <div className="mt-4 space-y-1">
          {hotel.info && (
            <p className="break-keep text-xs text-fg-subtle">
              {p("includes", {
                service: hotel.info.serviceChargePercent,
                tax: hotel.info.taxPercent,
              })}
            </p>
          )}
          <PriceDisclaimer />
        </div>
      </div>

      <h2 className="mt-14 text-2xl font-semibold text-fg">{t("roomsTitle")}</h2>

      {hotel.categories.length > 1 && (
        <nav className="mt-5 flex flex-wrap gap-2">
          {hotel.categories.map((category) => (
            <a
              key={category.key}
              href={`#category-${category.key}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              {category.label}
            </a>
          ))}
        </nav>
      )}

      {hotel.categories.map((category) => {
        const rooms = hotel.rooms.filter((r) => r.category === category.key);
        return (
          <section key={category.key} id={`category-${category.key}`} className="mt-12 scroll-mt-28">
            <Reveal>
              <h3 className="text-lg font-semibold text-fg">
                {category.label}
                <span className="ml-2 text-sm font-normal text-fg-subtle">{rooms.length}</span>
              </h3>
            </Reveal>
            <RevealGroup className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RevealItem key={room.slug}>
                  <RoomCard
                    href={`/hotels/${hotel.id}/rooms/${room.slug}${datesQuery}`}
                    name={room.name}
                    thumb={room.thumb}
                    summary={room.summary}
                    price={
                      <RoomPrice
                        variants={room.variants}
                        checkIn={dates.checkIn}
                        checkOut={dates.checkOut}
                        holidays={holidays}
                        info={hotel.info}
                      />
                    }
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        );
      })}
    </div>
  );
}
