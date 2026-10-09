import type { AppLocale } from "@/i18n/routing";
import { AMENITIES, type AmenityGroup } from "./amenities";
import { holidayinn } from "./holidayinn";
import { intercontinental } from "./intercontinental";
import { ixora } from "./ixora";
import type { Hotel, Localized, Room } from "./types";

export type { Hotel, HotelCategory, HotelId, Localized, Room } from "./types";

export const HOTELS: Hotel[] = [intercontinental, holidayinn, ixora];

export function getHotel(id: string): Hotel | undefined {
  return HOTELS.find((h) => h.id === id);
}

export function getRoom(hotel: Hotel, slug: string): Room | undefined {
  return hotel.rooms.find((r) => r.slug === slug);
}

/** 호텔 이미지 키를 실제 URL로 바꿉니다. 이미지 저장 위치(public → Supabase 등)를 옮길 때 이 함수만 고치면 됩니다. */
export function hotelImageSrc(key: string): string {
  return `/hotels/${key}`;
}

export function pickText(value: Localized, locale: string): string {
  return value[locale as AppLocale] ?? value.en;
}

export function groupAmenities(
  room: Room,
  locale: string
): Record<AmenityGroup, string[]> {
  const grouped: Record<AmenityGroup, string[]> = {
    facilities: [],
    equipment: [],
  };
  for (const id of room.amenities) {
    const amenity = AMENITIES[id];
    grouped[amenity.group].push(pickText(amenity.label, locale));
  }
  return grouped;
}
