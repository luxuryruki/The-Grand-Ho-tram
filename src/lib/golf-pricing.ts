import { parseIsoDate } from "./pricing";
import type { GolfSheet } from "./golf-schema";

export type GolfDayType = "weekday" | "weekend" | "holiday";
export type GolfHoles = "9" | "18";
export const GOLF_HOLES: GolfHoles[] = ["9", "18"];

export type GolfQuote =
  | { ok: true; type: GolfDayType; amount: number; dayName?: string }
  | { ok: false; reason: "incomplete" | "out-of-range" };

/** 날짜의 요금 종류. 표에 적힌 특정일(공휴일·주말 요금 적용일) > 토·일 > 평일(월~금) 순서입니다. */
export function golfDayType(iso: string, sheet: GolfSheet): { type: GolfDayType; name?: string } {
  const special = sheet.days.find((d) => d.date === iso);
  if (special) return { type: special.kind === "holiday" ? "holiday" : "weekend", name: special.name };
  const dow = new Date(parseIsoDate(iso) as number).getUTCDay();
  return { type: dow === 0 || dow === 6 ? "weekend" : "weekday" };
}

export function quoteGolf(sheet: GolfSheet, iso: string, holes: GolfHoles): GolfQuote {
  if (parseIsoDate(iso) === null) return { ok: false, reason: "incomplete" };
  if (iso < sheet.validFrom || iso > sheet.validTo) return { ok: false, reason: "out-of-range" };
  const { type, name } = golfDayType(iso, sheet);
  return { ok: true, type, amount: sheet.greenFees[type][holes], dayName: name };
}
