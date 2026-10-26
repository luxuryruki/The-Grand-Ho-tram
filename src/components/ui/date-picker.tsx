"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  compareMonth,
  formatDateLabel,
  monthOf,
  shiftMonth,
  todayIso,
  type MonthView,
} from "@/lib/calendar";
import { CalendarMonth } from "./calendar-month";
import { usePopover } from "./use-popover";

/** 날짜 하나를 고르는 달력. 브라우저 기본 날짜 선택기 대신 페이지 안에서 열립니다. */
export function DatePicker({
  id,
  value,
  onChange,
  min,
  holidays = [],
  className,
}: {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  holidays?: string[];
  className?: string;
}) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { open, setOpen, ref } = usePopover();
  const [today, setToday] = useState("");
  const [view, setView] = useState<MonthView>({ year: 2026, month: 0 });
  const holidaySet = useMemo(() => new Set(holidays), [holidays]);

  const effectiveMin = [min ?? "", today].reduce((a, b) => (b > a ? b : a), "");
  const minView = monthOf(effectiveMin);

  function toggle() {
    if (open) return setOpen(false);
    const now = todayIso();
    const floor = [min ?? "", now].reduce((a, b) => (b > a ? b : a), "");
    setToday(now);
    setView(monthOf(value || floor) ?? view);
    setOpen(true);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "flex h-11 w-full items-center gap-2.5 rounded-lg border bg-bg px-3.5 text-left text-sm transition-colors hover:border-border-strong",
          open ? "border-accent" : "border-border"
        )}
      >
        <CalendarDays size={16} className="shrink-0 text-accent" />
        <span className={cn("truncate", value ? "text-fg" : "text-fg-subtle")}>
          {value ? formatDateLabel(value, locale) : t("datePlaceholder")}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("calendarLabel")}
          className="absolute left-0 top-full z-40 mt-2 rounded-2xl border border-border-strong bg-bg-elevated p-4 shadow-[var(--shadow-card)]"
        >
          <CalendarMonth
            view={view}
            start={value}
            min={effectiveMin}
            today={today}
            holidays={holidaySet}
            onPick={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
            leading={
              <button
                type="button"
                aria-label={t("prevMonth")}
                disabled={minView ? compareMonth(shiftMonth(view, -1), minView) < 0 : false}
                onClick={() => setView(shiftMonth(view, -1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={18} />
              </button>
            }
            trailing={
              <button
                type="button"
                aria-label={t("nextMonth")}
                onClick={() => setView(shiftMonth(view, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg"
              >
                <ChevronRight size={18} />
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
