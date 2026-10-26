import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind 클래스 병합 유틸 (조건부 클래스 + 충돌 클래스 정리) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 반응 없는 값이면 대체 텍스트를 보여주기 위한 안전한 포맷터 */
export function formatDateRange(start: Date | string, end: Date | string, locale: string) {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;
  const formatter = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

/** 이벤트 날짜 표기: 하루 이벤트는 날짜 하나, 기간 이벤트는 시작일 – 종료일 */
export function formatEventDate(
  kind: "PERIOD" | "SINGLE_DAY",
  start: Date | string,
  end: Date | string,
  locale: string
) {
  if (kind === "SINGLE_DAY") {
    const date = typeof start === "string" ? new Date(start) : start;
    return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      timeZone: "UTC",
    }).format(date);
  }
  return formatDateRange(start, end, locale);
}
