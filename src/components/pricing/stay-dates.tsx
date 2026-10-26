"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";

/** 체크인·체크아웃 선택. 페이지 안에서 열리는 기간 선택 달력을 사용합니다. */
export function StayDates({
  checkIn,
  checkOut,
  min,
  holidays,
  months,
  onChange,
}: {
  checkIn: string;
  checkOut: string;
  min?: string;
  holidays?: string[];
  months?: 1 | 2;
  onChange: (next: { checkIn: string; checkOut: string }) => void;
}) {
  return (
    <DateRangePicker
      checkIn={checkIn}
      checkOut={checkOut}
      min={min}
      holidays={holidays}
      months={months}
      onChange={onChange}
    />
  );
}
