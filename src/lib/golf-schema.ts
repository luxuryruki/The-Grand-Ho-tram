import { z } from "zod";

// 골프 요금표 구조. DB(GolfRateSheet.data)와 가져오기 스크립트가 같은 스키마로 검증합니다.

const feesByHoles = z.object({
  "9": z.number().int().positive(),
  "18": z.number().int().positive(),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const golfSheetSchema = z.object({
  /** 이 기간 안의 날짜에만 요금을 계산합니다 */
  validFrom: isoDate,
  validTo: isoDate,
  /** 그린피(캐디·카트 포함, VND, 세금 포함) */
  greenFees: z.object({
    weekday: feesByHoles,
    weekend: feesByHoles,
    holiday: feesByHoles,
  }),
  extras: z.object({
    twilightDry: z.number().int().positive(),
    twilightWet: z.number().int().positive(),
    caddieBooking: z.number().int().positive(),
  }),
  /** 공휴일(holiday) 요금 또는 주말(weekend) 요금을 적용하는 특정 날짜 */
  days: z.array(
    z.object({
      date: isoDate,
      kind: z.enum(["holiday", "weekend"]),
      name: z.string(),
    })
  ),
});

export type GolfSheet = z.infer<typeof golfSheetSchema>;
