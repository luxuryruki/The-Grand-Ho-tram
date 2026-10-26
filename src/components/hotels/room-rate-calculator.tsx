"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MemberNotice } from "@/components/membership/member-notice";
import { LinkButton } from "@/components/ui/button";
import { StayDates } from "@/components/pricing/stay-dates";
import { StayQuote } from "@/components/pricing/stay-quote";
import { cn } from "@/lib/utils";
import type { RateVariant } from "@/lib/pricing";
import { parseIsoDate } from "@/lib/pricing";
import type { HotelPriceInfo } from "@/lib/rates";

/** 객실 상세 페이지의 요금 계산기: 날짜(와 객실 구성)를 고르면 박수·공휴일에 맞춰 예상 요금을 계산하고, 선택값을 그대로 예약 문의로 넘깁니다. */
export function RoomRateCalculator({
  hotelId,
  roomSlug,
  variants,
  holidays,
  info,
  initialCheckIn,
  initialCheckOut,
  initialRateKey,
}: {
  hotelId: string;
  roomSlug: string;
  variants: RateVariant[];
  holidays: string[];
  info: HotelPriceInfo | null;
  initialCheckIn: string;
  initialCheckOut: string;
  initialRateKey: string;
}) {
  const t = useTranslations("hotels");
  const p = useTranslations("pricing");
  const [dates, setDates] = useState({ checkIn: initialCheckIn, checkOut: initialCheckOut });
  const [rateKey, setRateKey] = useState(
    variants.some((v) => v.rateKey === initialRateKey) ? initialRateKey : (variants[0]?.rateKey ?? "")
  );
  const variant = variants.find((v) => v.rateKey === rateKey) ?? null;

  const params = new URLSearchParams({ source: `room:${hotelId}/${roomSlug}` });
  if (parseIsoDate(dates.checkIn) !== null && parseIsoDate(dates.checkOut) !== null) {
    params.set("checkIn", dates.checkIn);
    params.set("checkOut", dates.checkOut);
  }
  if (variant) params.set("rate", variant.rateKey);

  return (
    <div className="mt-8 space-y-5">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-fg">{p("datesTitle")}</h2>
        <StayDates
          checkIn={dates.checkIn}
          checkOut={dates.checkOut}
          min={info?.validFrom}
          holidays={holidays}
          months={1}
          onChange={setDates}
        />
      </div>

      {variants.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-sm text-fg-muted">{p("variant")}</legend>
          <div className="space-y-2">
            {variants.map((v) => (
              <label key={v.rateKey} className="block cursor-pointer">
                <input
                  type="radio"
                  name="rate"
                  value={v.rateKey}
                  checked={v.rateKey === rateKey}
                  onChange={() => setRateKey(v.rateKey)}
                  className="peer sr-only"
                />
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-sm text-fg transition",
                    "hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent"
                  )}
                >
                  <span className="break-words">{v.label}</span>
                  {v.promo && (
                    <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                      {t("promoBadge")}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <StayQuote
        variant={variant}
        checkIn={dates.checkIn}
        checkOut={dates.checkOut}
        holidays={holidays}
        info={info}
      />

      <MemberNotice />

      {variant?.promo && (
        <p className="break-keep rounded-lg bg-accent/10 px-4 py-3 text-sm leading-relaxed text-accent">
          {t("promoNotice")}
        </p>
      )}

      <LinkButton href={`/inquiry?${params.toString()}`} size="lg" className="w-full sm:w-auto">
        {t("roomReserveCta")}
      </LinkButton>
    </div>
  );
}
