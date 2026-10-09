import type { AppLocale } from "@/i18n/routing";
import type { AmenityId } from "./amenities";

export type Localized = Record<AppLocale, string>;

export type HotelId = "intercontinental" | "holidayinn" | "ixora";

export type HotelCategory = {
  key: string;
  label: Localized;
};

export type Room = {
  slug: string;
  category: string;
  /** 공식 객실명(영문 그대로 노출) */
  name: string;
  description: Localized;
  /** 언어와 무관한 표기. 예: "47 m²", "43–80 m²" */
  size: string;
  guests: Localized;
  /** 침대 구성 (InterContinental / Holiday Inn) */
  beds?: Localized;
  /** 침실 수 (Ixora) */
  bedrooms?: Localized;
  view: Localized;
  amenities: AmenityId[];
  /** `hotelImageSrc()`에 넘기는 키. 첫 번째가 대표 이미지 */
  images: string[];
};

export type Hotel = {
  id: HotelId;
  name: string;
  tagline: Localized;
  description: Localized;
  cover: string;
  checkIn?: string;
  checkOut?: string;
  categories: HotelCategory[];
  rooms: Room[];
};
