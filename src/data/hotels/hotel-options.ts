import type { RateBook, HotelPriceInfo } from "@/lib/rates";
import type { RateVariant } from "@/lib/pricing";
import { HOTELS, hotelImageSrc, pickText } from "./index";

export type RoomOption = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  thumb: string;
  /** 요금 구성 중 하나라도 프로모션 적용 가능하면 true */
  promo: boolean;
  /** DB 요금표의 요금 구성. 비어 있으면 요금은 상담으로 안내합니다. */
  variants: RateVariant[];
};

export type HotelOption = {
  id: string;
  name: string;
  tagline: string;
  cover: string;
  categories: { key: string; label: string }[];
  rooms: RoomOption[];
  info: HotelPriceInfo | null;
};

/** 화면에 내려줄 호텔·객실 목록. 클라이언트 번들에 호텔 전체 데이터가 실리지 않도록 현재 언어의 문구와 DB 요금만 추려서 만듭니다. */
export function buildHotelOptions(locale: string, book: RateBook): HotelOption[] {
  return HOTELS.map((hotel) => ({
    id: hotel.id,
    name: hotel.name,
    tagline: pickText(hotel.tagline, locale),
    cover: hotelImageSrc(hotel.cover),
    categories: hotel.categories.map((c) => ({
      key: c.key,
      label: pickText(c.label, locale),
    })),
    info: book.info[hotel.id] ?? null,
    rooms: hotel.rooms.map((room) => {
      const layout = room.beds ?? room.bedrooms;
      const variants: RateVariant[] = book.rates
        .filter((r) => r.hotelId === hotel.id && r.roomSlugs.includes(room.slug))
        .map((r) => ({
          rateKey: r.rateKey,
          label: locale === "ko" ? r.nameKo : r.nameEn.replace(/\s+/g, " ").trim(),
          promo: r.promo,
          weekday: r.weekday,
          friday: r.friday,
          saturday: r.saturday,
          publicHoliday: r.publicHoliday,
        }));
      return {
        slug: room.slug,
        name: room.name,
        category: room.category,
        summary: [
          room.size,
          layout ? pickText(layout, locale) : null,
          pickText(room.view, locale),
        ]
          .filter(Boolean)
          .join(" · "),
        thumb: hotelImageSrc(room.images[0]),
        promo: variants.some((v) => v.promo),
        variants,
      };
    }),
  }));
}
