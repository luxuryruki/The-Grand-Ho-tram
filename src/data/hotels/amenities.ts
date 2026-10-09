import type { Localized } from "./types";

export type AmenityGroup = "facilities" | "equipment";

export type AmenityId =
  | "balcony"
  | "bathroom-accessories"
  | "bathtub-shower"
  | "buffet-breakfast"
  | "cabana"
  | "coffee-maker"
  | "coffee-tea-supplies"
  | "connecting-room"
  | "kitchenette"
  | "mini-bar"
  | "private-jacuzzi"
  | "private-pool"
  | "room-service-24h"
  | "separate-living-room"
  | "sky-pool"
  | "standard-bathtub"
  | "walk-in-rain-shower"
  | "air-conditioning"
  | "air-conditioning-individual"
  | "alarm-clock"
  | "direct-dial-phone"
  | "docking-station"
  | "in-room-safe"
  | "ironing-board"
  | "tv-43-50"
  | "tv-46"
  | "tv-50"
  | "wifi"
  | "wifi-high-speed";

export const AMENITIES: Record<AmenityId, { group: AmenityGroup; label: Localized }> = {
  "balcony": { group: "facilities", label: { ko: "발코니", en: "Balcony" } },
  "bathroom-accessories": { group: "facilities", label: { ko: "기본 욕실 어메니티", en: "Basic bathroom accessories" } },
  "bathtub-shower": { group: "facilities", label: { ko: "욕조 및 샤워 시설", en: "Bathtub and Shower" } },
  "buffet-breakfast": { group: "facilities", label: { ko: "조식 뷔페", en: "Buffet Breakfast" } },
  "cabana": { group: "facilities", label: { ko: "전용 카바나", en: "Cabana" } },
  "coffee-maker": { group: "facilities", label: { ko: "커피 메이커", en: "Coffee Maker" } },
  "coffee-tea-supplies": { group: "facilities", label: { ko: "무료 커피·차 제공", en: "Complimentary Coffee and Tea Supplies" } },
  "connecting-room": { group: "facilities", label: { ko: "요청 시 커넥팅 룸 이용 가능", en: "Connecting Room Available on Request" } },
  "kitchenette": { group: "facilities", label: { ko: "객실 내 간이 주방", en: "In-room kitchenette" } },
  "mini-bar": { group: "facilities", label: { ko: "무료 미니바 (일부 음료)", en: "Complimentary Mini Bar (selected beverages)" } },
  "private-jacuzzi": { group: "facilities", label: { ko: "프라이빗 자쿠지", en: "Private Jacuzzi" } },
  "private-pool": { group: "facilities", label: { ko: "프라이빗 풀", en: "Private Pool" } },
  "room-service-24h": { group: "facilities", label: { ko: "24시간 룸서비스", en: "24 Hour Room Service" } },
  "separate-living-room": { group: "facilities", label: { ko: "별도 거실", en: "Separate Living Room" } },
  "sky-pool": { group: "facilities", label: { ko: "야외 스카이풀", en: "Outdoor sky-pool" } },
  "standard-bathtub": { group: "facilities", label: { ko: "욕조", en: "Standard Bathtub" } },
  "walk-in-rain-shower": { group: "facilities", label: { ko: "워크인 레인 샤워", en: "Walk-in Rain Shower" } },
  "air-conditioning": { group: "equipment", label: { ko: "에어컨", en: "Air conditioning" } },
  "air-conditioning-individual": { group: "equipment", label: { ko: "개별 제어 에어컨", en: "Individually Controlled Air Conditioning" } },
  "alarm-clock": { group: "equipment", label: { ko: "알람 시계", en: "Alarm Clock" } },
  "direct-dial-phone": { group: "equipment", label: { ko: "직통 전화", en: "Direct Dial Phone" } },
  "docking-station": { group: "equipment", label: { ko: "도킹 스테이션", en: "Docking station" } },
  "in-room-safe": { group: "equipment", label: { ko: "객실 내 금고", en: "In-room Safe" } },
  "ironing-board": { group: "equipment", label: { ko: "다리미판", en: "Ironing Board" } },
  "tv-43-50": { group: "equipment", label: { ko: "43/50인치 LED TV", en: "43/50 inch LED TV" } },
  "tv-46": { group: "equipment", label: { ko: "46인치 LED TV", en: "46 inch LED television" } },
  "tv-50": { group: "equipment", label: { ko: "50인치 LED TV", en: "50 inch LED television" } },
  "wifi": { group: "equipment", label: { ko: "무료 Wi-Fi", en: "WiFi" } },
  "wifi-high-speed": { group: "equipment", label: { ko: "무료 초고속 인터넷 (Wi-Fi)", en: "Free High Speed Internet (Wi-Fi)" } },
};
