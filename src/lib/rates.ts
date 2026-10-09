import "server-only";
import { prisma } from "./prisma";
import type { RateVariant } from "./pricing";

export type HotelPriceInfo = {
  extraBed: number | null;
  bedAndBreakfastAdult: number | null;
  breakfastChild: number | null;
  serviceChargePercent: number;
  taxPercent: number;
  /** 이 날짜(YYYY-MM-DD) 이후 숙박분부터 요금이 적용됩니다 */
  validFrom: string;
};

export type RateRow = Omit<RateVariant, "label"> & {
  hotelId: string;
  nameKo: string;
  nameEn: string;
  roomSlugs: string[];
  sortOrder: number;
};

export type RateBook = {
  rates: RateRow[];
  /** 베트남 공휴일 (YYYY-MM-DD) */
  holidays: string[];
  info: Record<string, HotelPriceInfo>;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** 화면과 예약 API가 공통으로 쓰는 요금 데이터를 DB에서 읽어옵니다. (행 수가 수십 개 수준이라 요청마다 조회합니다) */
export async function getRateBook(): Promise<RateBook> {
  const [rates, holidays, infos] = await Promise.all([
    prisma.roomRate.findMany({ orderBy: [{ hotelId: "asc" }, { sortOrder: "asc" }] }),
    prisma.publicHoliday.findMany({ orderBy: { date: "asc" } }),
    prisma.hotelRateInfo.findMany(),
  ]);

  return {
    rates: rates.map((r) => ({
      hotelId: r.hotelId,
      rateKey: r.rateKey,
      nameKo: r.nameKo,
      nameEn: r.nameEn,
      roomSlugs: r.roomSlugs,
      promo: r.promoEligible,
      weekday: r.weekday,
      friday: r.friday,
      saturday: r.saturday,
      publicHoliday: r.publicHoliday,
      sortOrder: r.sortOrder,
    })),
    holidays: holidays.map((h) => iso(h.date)),
    info: Object.fromEntries(
      infos.map((i) => [
        i.hotelId,
        {
          extraBed: i.extraBed,
          bedAndBreakfastAdult: i.bedAndBreakfastAdult,
          breakfastChild: i.breakfastChild,
          serviceChargePercent: i.serviceChargePercent,
          taxPercent: i.taxPercent,
          validFrom: iso(i.validFrom),
        },
      ])
    ),
  };
}
