"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  MAX_QUOTE_NIGHTS,
  formatVnd,
  quoteStay,
  summarizeLines,
  type DayType,
  type RateVariant,
} from "@/lib/pricing";
import type { HotelPriceInfo } from "@/lib/rates";
import { PriceDisclaimer } from "./price-disclaimer";

const DAY_LABEL_KEY: Record<DayType, "dayWeekday" | "dayFriday" | "daySaturday" | "dayHoliday"> = {
  weekday: "dayWeekday",
  friday: "dayFriday",
  saturday: "daySaturday",
  holiday: "dayHoliday",
};

function formatDay(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** 선택한 요금 구성 + 날짜로 계산한 예상 요금 패널. 금액이 보일 때는 항상 "참고용" 안내 문구가 함께 표시됩니다. */
export function StayQuote({
  variant,
  checkIn,
  checkOut,
  holidays,
  info,
  hasRoom = true,
}: {
  variant: RateVariant | null;
  checkIn: string;
  checkOut: string;
  holidays: string[];
  info: HotelPriceInfo | null;
  /** 객실을 아직 고르지 않은 경우(false)에는 객실 선택 안내를 보여줍니다 */
  hasRoom?: boolean;
}) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const holidaySet = useMemo(() => new Set(holidays), [holidays]);

  const quote = useMemo(
    () => (variant ? quoteStay(variant, checkIn, checkOut, holidaySet, info?.validFrom) : null),
    [variant, checkIn, checkOut, holidaySet, info?.validFrom]
  );

  // 요금이 등록되지 않은 객실은 요금 영역 자체를 보여주지 않습니다.
  if (hasRoom && !variant) return null;

  let body: React.ReactNode;
  if (!hasRoom) {
    body = <p className="text-sm text-fg-muted">{t("needRoom")}</p>;
  } else if (!quote || !quote.ok) {
    const reason = quote && !quote.ok ? quote.reason : "incomplete";
    body = (
      <p className="break-keep text-sm text-fg-muted">
        {reason === "order"
          ? t("invalidOrder")
          : reason === "too-long"
            ? t("tooLong", { max: MAX_QUOTE_NIGHTS })
            : reason === "before-valid" && info
              ? t("beforeValid", { date: formatDay(info.validFrom, locale) })
              : t("askDates")}
      </p>
    );
  } else {
    const groups = summarizeLines(quote.lines);
    const hasHoliday = groups.some((g) => g.type === "holiday");
    const extras = [
      info?.extraBed ? t("extraBed", { price: formatVnd(info.extraBed) }) : null,
      info?.bedAndBreakfastAdult ? t("bedAndBreakfast", { price: formatVnd(info.bedAndBreakfastAdult) }) : null,
      info?.breakfastChild ? t("breakfastChild", { price: formatVnd(info.breakfastChild) }) : null,
    ].filter(Boolean);

    body = (
      <div className="space-y-4">
        <div>
          <p className="text-xs text-fg-subtle">
            {t("total")} · {t("nights", { count: quote.nights })}
          </p>
          <p className="mt-1 text-2xl font-semibold text-accent">{formatVnd(quote.total)}</p>
          {quote.nights > 1 && (
            <p className="mt-1 text-xs text-fg-muted">
              {t("average")} {formatVnd(quote.average)}
            </p>
          )}
        </div>

        <ul className="space-y-1.5 border-t border-border pt-3 text-sm text-fg-muted">
          {groups.map((g) => (
            <li key={g.type} className="flex items-baseline justify-between gap-3">
              <span>
                {t("nightLine", {
                  type: t(DAY_LABEL_KEY[g.type]),
                  count: g.nights,
                  price: formatVnd(g.amount),
                })}
              </span>
              <span className="shrink-0 text-fg">{formatVnd(g.subtotal)}</span>
            </li>
          ))}
        </ul>

        {quote.nights > 1 && (
          <details className="text-xs text-fg-muted">
            <summary className="cursor-pointer select-none text-fg-muted hover:text-fg">
              {t("showDetail")}
            </summary>
            <ul className="mt-2 space-y-1">
              {quote.lines.map((l) => (
                <li key={l.date} className="flex justify-between gap-3">
                  <span>
                    {formatDay(l.date, locale)} · {t(DAY_LABEL_KEY[l.type])}
                  </span>
                  <span className="text-fg">{formatVnd(l.amount)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="space-y-1 border-t border-border pt-3 text-xs leading-relaxed text-fg-subtle">
          {info && (
            <p className="break-keep">
              {t("includes", { service: info.serviceChargePercent, tax: info.taxPercent })}
            </p>
          )}
          {hasHoliday && <p className="break-keep">{t("holidayNote")}</p>}
          {extras.length > 0 && (
            <div className="pt-1">
              <p className="break-keep">{t("extraPerson")}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-fg-muted marker:text-fg-subtle">
                {extras.map((line) => (
                  <li key={line} className="break-keep">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <PriceDisclaimer className="rounded-lg bg-bg px-3 py-2.5 text-fg-muted" />
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-bg-elevated p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-fg">{t("estimateTitle")}</h3>
      {body}
    </section>
  );
}
