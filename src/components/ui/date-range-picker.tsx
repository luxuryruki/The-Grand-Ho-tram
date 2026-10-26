"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  compareMonth,
  formatDateLabel,
  monthOf,
  nightsBetween,
  shiftMonth,
  todayIso,
  type MonthView,
} from "@/lib/calendar";
import { CalendarMonth } from "./calendar-month";
import { usePopover } from "./use-popover";

const MAX_MONTHS_AHEAD = 18;

type Value = { checkIn: string; checkOut: string };

/**
 * 체크인 → 체크아웃 순서로 누르는 기간 선택 달력. 브라우저 기본 날짜 선택기 대신 페이지 안에서 열립니다.
 * 이 컴포넌트는 필수 입력 검사를 하지 않으므로, 폼에서는 제출 시 값이 비었는지 직접 확인하세요.
 */
export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  min,
  holidays = [],
  months = 2,
  className,
}: Value & {
  onChange: (next: Value) => void;
  /** 선택 가능한 가장 이른 날짜. 오늘보다 이른 날짜는 항상 막습니다. */
  min?: string;
  holidays?: string[];
  months?: 1 | 2;
  className?: string;
}) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { open, setOpen, ref } = usePopover();
  const [today, setToday] = useState("");
  const [draft, setDraft] = useState("");
  const [hover, setHover] = useState("");
  const [view, setView] = useState<MonthView>({ year: 2026, month: 0 });
  const [focus, setFocus] = useState<"in" | "out">("in");
  const holidaySet = useMemo(() => new Set(holidays), [holidays]);

  const effectiveMin = [min ?? "", today].reduce((a, b) => (b > a ? b : a), "");
  const minView = monthOf(effectiveMin);
  const lastView = minView ? shiftMonth(minView, MAX_MONTHS_AHEAD) : null;

  function openFor(kind: "in" | "out") {
    const now = todayIso();
    const floor = [min ?? "", now].reduce((a, b) => (b > a ? b : a), "");
    setToday(now);
    setFocus(kind);
    setDraft(kind === "out" && checkIn ? checkIn : "");
    setHover("");
    const anchor = (kind === "out" ? checkOut || checkIn : checkIn) || floor;
    setView(monthOf(anchor) ?? monthOf(floor) ?? view);
    setOpen(true);
  }

  function pick(iso: string) {
    if (!draft || iso <= draft) {
      setDraft(iso);
      setFocus("out");
      return;
    }
    onChange({ checkIn: draft, checkOut: iso });
    setDraft("");
    setHover("");
    setOpen(false);
  }

  const start = draft || checkIn;
  const end = draft ? "" : checkOut;
  const nights = nightsBetween(checkIn, checkOut);
  const canPrev = minView ? compareMonth(shiftMonth(view, -1), minView) >= 0 : true;
  const canNext = lastView ? compareMonth(shiftMonth(view, months), lastView) <= 0 : true;

  const field = (kind: "in" | "out", label: string, value: string) => (
    <div>
      <span className="mb-1.5 block text-sm text-fg-muted">{label}</span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => openFor(kind)}
        className={cn(
          "flex h-11 w-full items-center gap-2.5 rounded-lg border bg-bg px-3.5 text-left text-sm transition-colors hover:border-border-strong",
          open && focus === kind ? "border-accent" : "border-border"
        )}
      >
        <CalendarDays size={16} className="shrink-0 text-accent" />
        <span className={cn("truncate", value ? "text-fg" : "text-fg-subtle")}>
          {value ? formatDateLabel(value, locale) : t("datePlaceholder")}
        </span>
      </button>
    </div>
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="grid grid-cols-2 gap-3">
        {field("in", t("checkIn"), checkIn)}
        {field("out", t("checkOut"), checkOut)}
      </div>

      {open && (
        <div
          role="dialog"
          aria-label={t("calendarLabel")}
          className="absolute left-1/2 top-full z-40 mt-2 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 rounded-2xl md:left-0 md:translate-x-0 border border-border-strong bg-bg-elevated p-4 shadow-[var(--shadow-card)]"
        >
          <div className="flex gap-6">
            {Array.from({ length: months }, (_, i) => (
              <div key={i} className={i === 1 ? "hidden md:block" : undefined}>
                <CalendarMonth
                  view={shiftMonth(view, i)}
                  start={start}
                  end={end}
                  hover={hover}
                  min={effectiveMin}
                  today={today}
                  holidays={holidaySet}
                  onPick={pick}
                  onHover={(iso) => setHover(iso ?? "")}
                  leading={
                    i === 0 ? (
                      <NavButton label={t("prevMonth")} disabled={!canPrev} onClick={() => setView(shiftMonth(view, -1))}>
                        <ChevronLeft size={18} />
                      </NavButton>
                    ) : undefined
                  }
                  trailing={
                    i === months - 1 ? (
                      <NavButton label={t("nextMonth")} disabled={!canNext} onClick={() => setView(shiftMonth(view, 1))}>
                        <ChevronRight size={18} />
                      </NavButton>
                    ) : undefined
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
            <p className="font-medium text-fg">
              {draft
                ? t("pickCheckOut")
                : nights > 0
                  ? t("nights", { count: nights })
                  : t("pickCheckIn")}
            </p>
            <div className="flex items-center gap-4">
              {holidays.length > 0 && (
                <span className="flex items-center gap-1.5 text-fg-subtle">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                  {t("holidayLegend")}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  onChange({ checkIn: "", checkOut: "" });
                  setDraft("");
                  setHover("");
                  setFocus("in");
                }}
                className="text-fg-muted underline-offset-4 hover:text-fg hover:underline"
              >
                {t("clearDates")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
