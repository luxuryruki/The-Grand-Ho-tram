import type { Localized } from "./hotels/types";

export type VehicleId = "carnival" | "solati";

export type Vehicle = {
  id: VehicleId;
  name: Localized;
  /** 적재 안내 (골프백·캐리어 기준) */
  luggage: Localized;
};

/** 예약 요청에서 선택할 수 있는 차량. 이 두 종류만 운영합니다. */
export const VEHICLES: Vehicle[] = [
  {
    id: "carnival",
    name: { ko: "카니발 7인승", en: "Carnival (7 seats)" },
    luggage: {
      ko: "골프백 포함, 캐리어 2인 적합",
      en: "Golf bags included · suits luggage for 2 people",
    },
  },
  {
    id: "solati",
    name: { ko: "솔라티 9인승", en: "Solati (9 seats)" },
    luggage: {
      ko: "골프백, 캐리어 4인 적합",
      en: "Golf bags · suits luggage for 4 people",
    },
  },
];

export function vehicleText(value: Localized, locale: string): string {
  return value[locale as keyof Localized] ?? value.en;
}

export function getVehicle(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}
