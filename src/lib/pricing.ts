// 숙박 요금 계산. 서버(예약 API)와 화면(요금 계산기)이 같은 함수를 사용합니다.
// 날짜는 "YYYY-MM-DD" 문자열로만 다루고 UTC 기준으로 계산해서, 브라우저 시간대와 무관하게 같은 결과가 나옵니다.

export const MAX_QUOTE_NIGHTS = 30;

export type DayType = "weekday" | "friday" | "saturday" | "holiday";

/** 요금표 한 행의 요금(VND). 서비스 요금·세금이 포함된 금액입니다. */
export type RateVariant = {
  rateKey: string;
  /** 객실 구성 이름 (예: "1베드 발코니 레지던스") */
  label: string;
  promo: boolean;
  weekday: number;
  /** 금요일 요금이 따로 없는 호텔은 null → 평일 요금 적용 */
  friday: number | null;
  saturday: number;
  publicHoliday: number;
};

export type StayLine = { date: string; type: DayType; amount: number };

export type Quote =
  | { ok: true; nights: number; lines: StayLine[]; total: number; average: number }
  | { ok: false; reason: "incomplete" | "order" | "too-long" | "before-valid" };

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(value: string): number | null {
  const m = ISO.exec(value);
  if (!m) return null;
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(ms);
  // 2월 31일 같은 존재하지 않는 날짜 거르기
  if (d.getUTCMonth() !== Number(m[2]) - 1) return null;
  return ms;
}

export function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(value: string, days: number): string | null {
  const ms = parseIsoDate(value);
  return ms === null ? null : toIsoDate(ms + days * DAY_MS);
}

/** 그날 밤(체크인 날짜 ~ 체크아웃 전날)에 적용되는 요금 종류. 공휴일 > 토요일 > 금요일 > 평일 순서입니다. */
export function dayTypeOf(isoDate: string, holidays: ReadonlySet<string>): DayType {
  if (holidays.has(isoDate)) return "holiday";
  const dow = new Date(parseIsoDate(isoDate) as number).getUTCDay();
  if (dow === 6) return "saturday";
  if (dow === 5) return "friday";
  return "weekday";
}

export function nightlyRate(rate: RateVariant, type: DayType): number {
  switch (type) {
    case "holiday":
      return rate.publicHoliday;
    case "saturday":
      return rate.saturday;
    case "friday":
      return rate.friday ?? rate.weekday;
    default:
      return rate.weekday;
  }
}

export function quoteStay(
  rate: RateVariant,
  checkIn: string,
  checkOut: string,
  holidays: ReadonlySet<string>,
  validFrom?: string | null
): Quote {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  if (start === null || end === null) return { ok: false, reason: "incomplete" };
  if (end <= start) return { ok: false, reason: "order" };
  const nights = Math.round((end - start) / DAY_MS);
  if (nights > MAX_QUOTE_NIGHTS) return { ok: false, reason: "too-long" };
  if (validFrom && checkIn < validFrom) return { ok: false, reason: "before-valid" };

  const lines: StayLine[] = [];
  for (let i = 0; i < nights; i++) {
    const date = toIsoDate(start + i * DAY_MS);
    const type = dayTypeOf(date, holidays);
    lines.push({ date, type, amount: nightlyRate(rate, type) });
  }
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { ok: true, nights, lines, total, average: Math.round(total / nights) };
}

/** 같은 종류의 박을 묶어서 "토요일 2박 × 4,127,760" 형태로 보여주기 위한 집계 */
export function summarizeLines(lines: StayLine[]) {
  const order: DayType[] = ["weekday", "friday", "saturday", "holiday"];
  return order
    .map((type) => {
      const group = lines.filter((l) => l.type === type);
      return { type, nights: group.length, amount: group[0]?.amount ?? 0, subtotal: group.reduce((s, l) => s + l.amount, 0) };
    })
    .filter((g) => g.nights > 0);
}

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(amount))} VND`;
}
