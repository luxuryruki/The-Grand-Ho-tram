"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { monthTitle, monthWeeks, weekdayLabels, type MonthView } from "@/lib/calendar";

type Props = {
  view: MonthView;
  /** 선택된 시작일/종료일. 단일 선택이면 start만 넘깁니다. */
  start?: string;
  end?: string;
  /** 종료일을 고르는 중일 때 마우스가 올라간 날짜(범위 미리보기) */
  hover?: string;
  /** 이 날짜보다 이전은 선택할 수 없습니다 */
  min?: string;
  today?: string;
  holidays?: ReadonlySet<string>;
  onPick: (iso: string) => void;
  onHover?: (iso: string | null) => void;
  /** 월 제목 양옆에 들어가는 이전/다음 달 버튼 */
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function CalendarMonth({
  view,
  start,
  end,
  hover,
  min,
  today,
  holidays,
  onPick,
  onHover,
  leading,
  trailing,
}: Props) {
  const locale = useLocale();
  const weeks = monthWeeks(view);
  const rangeEnd = end || (start && hover && hover > start ? hover : "");

  return (
    <div className="w-[17.5rem] max-w-full">
      <div className="mb-3 flex h-9 items-center justify-between">
        <div className="w-9">{leading}</div>
        <p className="text-sm font-semibold text-fg">{monthTitle(view, locale)}</p>
        <div className="flex w-9 justify-end">{trailing}</div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-fg-subtle">
        {weekdayLabels(locale).map((label, i) => (
          <div key={i} className="py-1.5">
            {label}
          </div>
        ))}
      </div>

      <div onMouseLeave={() => onHover?.(null)}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((iso, di) => {
              if (!iso) return <div key={di} className="h-10" />;
              const disabled = Boolean(min && iso < min);
              const isStart = iso === start;
              const isEnd = Boolean(rangeEnd) && iso === rangeEnd;
              const inRange = Boolean(start && rangeEnd && iso > start && iso < rangeEnd);
              const isHoliday = holidays?.has(iso) ?? false;
              const day = Number(iso.slice(8));

              return (
                <div key={iso} className="relative h-10">
                  {inRange && <span className="absolute inset-x-0 inset-y-1 bg-accent/15" />}
                  {isStart && rangeEnd && (
                    <span className="absolute inset-y-1 left-1/2 right-0 bg-accent/15" />
                  )}
                  {isEnd && start && (
                    <span className="absolute inset-y-1 left-0 right-1/2 bg-accent/15" />
                  )}
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={iso}
                    aria-pressed={isStart || isEnd}
                    onClick={() => onPick(iso)}
                    onMouseEnter={() => onHover?.(iso)}
                    className={cn(
                      "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
                      disabled && "cursor-not-allowed text-fg-subtle/40",
                      !disabled && !isStart && !isEnd && "text-fg hover:bg-bg-elevated-2",
                      (isStart || isEnd) && "bg-accent font-semibold text-accent-fg",
                      today === iso && !isStart && !isEnd && "ring-1 ring-border-strong"
                    )}
                  >
                    {day}
                    {isHoliday && (
                      <span
                        className={cn(
                          "absolute bottom-1 h-1 w-1 rounded-full",
                          isStart || isEnd ? "bg-accent-fg" : "bg-danger"
                        )}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
