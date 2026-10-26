import { useTranslations } from "next-intl";
import { PRICES_VISIBLE } from "@/lib/features";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { MemberNotice } from "@/components/membership/member-notice";
import { PriceDisclaimer } from "@/components/pricing/price-disclaimer";
import { RoomPrice } from "@/components/pricing/room-price";
import type { HotelOption } from "@/data/hotels/hotel-options";
import { RoomCard } from "./room-card";

/** 호텔 페이지의 객실 목록. 카드에는 DB 요금표의 평일 1박 최저 요금이 표시됩니다. */
export function HotelRoomBrowser({
  hotel,
  holidays,
}: {
  hotel: HotelOption;
  holidays: string[];
}) {
  const t = useTranslations("hotels");
  const p = useTranslations("pricing");

  return (
    <div>
      <div className="space-y-4">
        {PRICES_VISIBLE && (
          <div className="space-y-1">
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
        )}
        <MemberNotice />
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
                    href={`/hotels/${hotel.id}/rooms/${room.slug}`}
                    name={room.name}
                    thumb={room.thumb}
                    summary={room.summary}
                    price={
                      <RoomPrice
                        variants={room.variants}
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
