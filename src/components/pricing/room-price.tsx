"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { formatVnd, quoteStay, type RateVariant } from "@/lib/pricing";
import type { HotelPriceInfo } from "@/lib/rates";

/**
 * 객실 카드에 들어가는 한 줄 요금.
 * 날짜가 유효하면 해당 숙박의 합계(요금 구성이 여러 개면 가장 낮은 금액부터), 아니면 평일 1박 기준 최저 요금을 보여줍니다.
 */
export function RoomPrice({
  variants,
  checkIn = "",
  checkOut = "",
  holidays,
  info,
}: {
  variants: RateVariant[];
  checkIn?: string;
  checkOut?: string;
  holidays: string[];
  info: HotelPriceInfo | null;
}) {
  const t = useTranslations("pricing");
  const holidaySet = useMemo(() => new Set(holidays), [holidays]);

  if (variants.length === 0) {
    return <p className="text-sm text-fg-muted">{t("noRate")}</p>;
  }

  const quotes = variants.map((v) => quoteStay(v, checkIn, checkOut, holidaySet, info?.validFrom));
  const totals = quotes.flatMap((q) => (q.ok ? [q] : []));

  if (totals.length === variants.length) {
    const min = totals.reduce((a, b) => (b.total < a.total ? b : a));
    return (
      <p className="text-sm font-medium text-accent">
        {t(variants.length > 1 ? "fromTotal" : "totalOnly", {
          nights: min.nights,
          price: formatVnd(min.total),
        })}
      </p>
    );
  }

  const lowest = Math.min(...variants.map((v) => v.weekday));
  return (
    <p className="text-sm font-medium text-accent">{t("fromWeekday", { price: formatVnd(lowest) })}</p>
  );
}
