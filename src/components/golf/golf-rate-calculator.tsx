"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { DatePicker } from "@/components/ui/date-picker";
import { GOLF_RATES, golfText } from "@/data/golf";
import { formatDateLabel } from "@/lib/calendar";
import { GOLF_HOLES, quoteGolf, type GolfHoles } from "@/lib/golf-pricing";
import type { GolfSheet } from "@/lib/golf-schema";
import { formatVnd } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/** 날짜와 홀 수를 고르면 그 날짜에 적용되는 그린피를 보여줍니다. */
export function GolfRateCalculator({ sheet }: { sheet: GolfSheet }) {
  const locale = useLocale();
  const [date, setDate] = useState("");
  const [holes, setHoles] = useState<GolfHoles>("18");
  const t = (v: Parameters<typeof golfText>[0]) => golfText(v, locale);

  const holidays = sheet.days.filter((d) => d.kind === "holiday").map((d) => d.date);
  const quote = date ? quoteGolf(sheet, date, holes) : null;

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6">
      <h3 className="text-base font-semibold text-fg">{t(GOLF_RATES.calcTitle)}</h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-sm text-fg-muted">{t(GOLF_RATES.calcDate)}</span>
          <DatePicker
            value={date}
            onChange={setDate}
            min={sheet.validFrom}
            holidays={holidays}
          />
        </div>
        <div>
          <span className="mb-1.5 block text-sm text-fg-muted">{t(GOLF_RATES.calcHoles)}</span>
          <div className="grid grid-cols-4 gap-2">
            {GOLF_HOLES.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHoles(h)}
                className={cn(
                  "h-11 rounded-lg border text-sm transition-colors",
                  holes === h
                    ? "border-accent bg-accent/10 font-medium text-accent"
                    : "border-border text-fg-muted hover:border-border-strong"
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-bg p-4">
        {!quote ? (
          <p className="break-keep text-sm text-fg-muted">{t(GOLF_RATES.calcPick)}</p>
        ) : quote.ok ? (
          <div>
            <p className="text-xs text-fg-subtle">
              {formatDateLabel(date, locale)} · {t(GOLF_RATES.dayType[quote.type])} · {holes}
              {t(GOLF_RATES.holesLabel)}
            </p>
            <p className="mt-1 text-2xl font-semibold text-accent">{formatVnd(quote.amount)}</p>
            {quote.dayName && (
              <p className="mt-1 break-keep text-xs text-fg-muted">{quote.dayName}</p>
            )}
          </div>
        ) : (
          <p className="break-keep text-sm text-fg-muted">{t(GOLF_RATES.calcOutOfRange)}</p>
        )}
      </div>
    </div>
  );
}
