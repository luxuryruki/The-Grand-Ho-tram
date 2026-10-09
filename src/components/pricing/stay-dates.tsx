"use client";

import { useTranslations } from "next-intl";
import { addDays } from "@/lib/pricing";

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-fg focus:border-border-strong focus:outline-none";

/** 체크인·체크아웃 날짜 입력. 체크인을 바꿨을 때 체크아웃이 비었거나 같거나 빠르면 다음 날로 맞춰줍니다. */
export function StayDates({
  checkIn,
  checkOut,
  min,
  onChange,
}: {
  checkIn: string;
  checkOut: string;
  min?: string;
  onChange: (next: { checkIn: string; checkOut: string }) => void;
}) {
  const t = useTranslations("pricing");

  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="block">
        <span className="mb-1.5 block text-sm text-fg-muted">{t("checkIn")}</span>
        <input
          type="date"
          min={min}
          value={checkIn}
          onChange={(e) => {
            const value = e.target.value;
            const next = value && (!checkOut || checkOut <= value) ? addDays(value, 1) ?? "" : checkOut;
            onChange({ checkIn: value, checkOut: next });
          }}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-fg-muted">{t("checkOut")}</span>
        <input
          type="date"
          min={checkIn ? addDays(checkIn, 1) ?? min : min}
          value={checkOut}
          onChange={(e) => onChange({ checkIn, checkOut: e.target.value })}
          className={inputClass}
        />
      </label>
    </div>
  );
}
