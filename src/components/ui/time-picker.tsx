"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { usePopover } from "./use-popover";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

/** "HH:mm" 시간을 고르는 선택기. 브라우저 기본 시간 선택기 대신 페이지 안에서 열립니다. */
export function TimePicker({
  id,
  value,
  onChange,
  step = 5,
  className,
}: {
  id?: string;
  value: string;
  onChange: (time: string) => void;
  step?: number;
  className?: string;
}) {
  const t = useTranslations("pricing");
  const { open, setOpen, ref } = usePopover();
  const hourCol = useRef<HTMLDivElement>(null);
  const minuteCol = useRef<HTMLDivElement>(null);
  const [hour, minute] = value ? value.split(":") : ["", ""];
  const minutes = Array.from({ length: Math.floor(60 / step) }, (_, i) => String(i * step).padStart(2, "0"));

  useEffect(() => {
    if (!open) return;
    for (const col of [hourCol.current, minuteCol.current]) {
      const selected = col?.querySelector<HTMLElement>("[data-selected=true]");
      if (col && selected) col.scrollTop = selected.offsetTop - col.clientHeight / 2 + selected.clientHeight / 2;
    }
  }, [open]);

  const cell = (selected: boolean) =>
    cn(
      "flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors",
      selected ? "bg-accent font-semibold text-accent-fg" : "text-fg hover:bg-bg-elevated-2"
    );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-11 w-full items-center gap-2.5 rounded-lg border bg-bg px-3.5 text-left text-sm transition-colors hover:border-border-strong",
          open ? "border-accent" : "border-border"
        )}
      >
        <Clock size={16} className="shrink-0 text-accent" />
        <span className={cn(value ? "text-fg" : "text-fg-subtle")}>{value || t("timePlaceholder")}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("timePlaceholder")}
          className="absolute right-0 top-full z-40 mt-2 w-48 rounded-2xl border border-border-strong bg-bg-elevated p-3 shadow-[var(--shadow-card)]"
        >
          <div className="grid grid-cols-2 gap-2 pb-1 text-center text-xs text-fg-subtle">
            <span>{t("hourLabel")}</span>
            <span>{t("minuteLabel")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div ref={hourCol} className="relative h-48 space-y-0.5 overflow-y-auto pr-1">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-selected={h === hour}
                  onClick={() => onChange(`${h}:${minute || "00"}`)}
                  className={cell(h === hour)}
                >
                  {h}
                </button>
              ))}
            </div>
            <div ref={minuteCol} className="relative h-48 space-y-0.5 overflow-y-auto pr-1">
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  data-selected={m === minute}
                  onClick={() => {
                    onChange(`${hour || "09"}:${m}`);
                    setOpen(false);
                  }}
                  className={cell(m === minute)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
