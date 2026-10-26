import { addDays, parseIsoDate, toIsoDate } from "./pricing";

// 달력 계산. 날짜는 pricing.ts와 같이 "YYYY-MM-DD" 문자열 + UTC 기준으로만 다룹니다.

export type MonthView = { year: number; month: number };

/** 브라우저의 현지 시간 기준 오늘 날짜 (클라이언트에서만 호출) */
export function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function monthOf(iso: string): MonthView | null {
  const ms = parseIsoDate(iso);
  if (ms === null) return null;
  const d = new Date(ms);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

export function shiftMonth(view: MonthView, delta: number): MonthView {
  const index = view.year * 12 + view.month + delta;
  return { year: Math.floor(index / 12), month: ((index % 12) + 12) % 12 };
}

export function compareMonth(a: MonthView, b: MonthView): number {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

/** 일요일 시작 주 단위 배열. 해당 월이 아닌 칸은 null */
export function monthWeeks(view: MonthView): (string | null)[][] {
  const first = Date.UTC(view.year, view.month, 1);
  const lead = new Date(first).getUTCDay();
  const days = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(toIsoDate(Date.UTC(view.year, view.month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function weekdayLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    weekday: locale === "ko" ? "short" : "narrow",
    timeZone: "UTC",
  });
  // 2021-08-01 은 일요일
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2021, 7, 1 + i))));
}

export function monthTitle(view: MonthView, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(view.year, view.month, 1)));
}

/** 필드에 보여줄 날짜. 예) 2026년 12월 25일 (금) */
export function formatDateLabel(iso: string, locale: string): string {
  const ms = parseIsoDate(iso);
  if (ms === null) return "";
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(ms));
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseIsoDate(checkIn);
  const b = parseIsoDate(checkOut);
  return a === null || b === null || b <= a ? 0 : Math.round((b - a) / 86_400_000);
}

export { addDays };
