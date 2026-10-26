"use client";

import { useState, type ChangeEvent } from "react";
import { addDays } from "@/lib/pricing";

export type EventFormValues = {
  title: string;
  description: string;
  kind: "PERIOD" | "SINGLE_DAY";
  startDate: string;
  endDate: string;
  isPublished: boolean;
  publishFrom: string;
  publishUntil: string;
};

/** 게시 종료일 자동값: 이벤트가 끝나는 날의 다음날 (하루 이벤트는 이벤트 날짜의 다음날) */
export function nextDayAfterEvent(v: Pick<EventFormValues, "kind" | "startDate" | "endDate">): string | null {
  const last = v.kind === "SINGLE_DAY" ? v.startDate : v.endDate;
  return last ? addDays(last, 1) : null;
}

export const EMPTY_EVENT_VALUES: EventFormValues = {
  title: "",
  description: "",
  kind: "PERIOD",
  startDate: "",
  endDate: "",
  isPublished: false,
  publishFrom: "",
  publishUntil: "",
};

/** 서버로 보낼 값. 하루 이벤트는 종료일을 보내지 않고, 비어 있는 게시 기간은 null(제한 없음)입니다. */
export function toEventPayload(v: EventFormValues) {
  return {
    title: v.title,
    description: v.description,
    kind: v.kind,
    startDate: v.startDate,
    endDate: v.kind === "SINGLE_DAY" ? null : v.endDate,
    isPublished: v.isPublished,
    publishFrom: v.publishFrom || null,
    publishUntil: v.publishUntil || null,
  };
}

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-fg focus:border-border-strong focus:outline-none";

const KINDS = [
  { value: "PERIOD", label: "기간", hint: "시작일부터 종료일까지 진행" },
  { value: "SINGLE_DAY", label: "날짜", hint: "하루만 진행" },
] as const;

/** 이벤트 등록·수정 공통 입력 항목: 기본 정보, 진행 날짜(형태별), 게시 기간, 공개 스위치 */
export function EventFields({
  values,
  onChange,
  publishLabel,
  isNew,
}: {
  values: EventFormValues;
  onChange: (next: EventFormValues) => void;
  publishLabel: string;
  /** 새 이벤트면 게시 종료일을 이벤트 날짜에 맞춰 자동으로 채웁니다. 수정 화면은 이미 직접 정한 값이 있으면 건드리지 않습니다. */
  isNew: boolean;
}) {
  // 게시 종료일을 직접 고친 뒤에는 자동으로 덮어쓰지 않습니다.
  const [untilTouched, setUntilTouched] = useState(() => !isNew && values.publishUntil !== (nextDayAfterEvent(values) ?? ""));

  /** 값을 바꾸고, 날짜 관련 항목이 바뀌었으면 게시 종료일을 "이벤트 종료 다음날"로 맞춥니다. */
  const update = (patch: Partial<EventFormValues>) => {
    const next = { ...values, ...patch };
    const dateChanged = "startDate" in patch || "endDate" in patch || "kind" in patch;
    if (dateChanged && !untilTouched) {
      const auto = nextDayAfterEvent(next);
      if (auto) next.publishUntil = auto;
    }
    onChange(next);
  };

  const set =
    <K extends keyof EventFormValues>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update({ [key]: e.target.value } as Partial<EventFormValues>);

  const single = values.kind === "SINGLE_DAY";

  return (
    <>
      <div>
        <label className="mb-1.5 block text-sm text-fg-muted">제목</label>
        <input required value={values.title} onChange={set("title")} className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-fg-muted">설명</label>
        <textarea required rows={6} value={values.description} onChange={set("description")} className={inputClass} />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm text-fg-muted">이벤트 일정</legend>
        <div className="grid grid-cols-2 gap-3">
          {KINDS.map((k) => (
            <label
              key={k.value}
              className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors ${
                values.kind === k.value ? "border-accent bg-accent/10" : "border-border hover:border-border-strong"
              }`}
            >
              <input
                type="radio"
                name="event-kind"
                value={k.value}
                checked={values.kind === k.value}
                onChange={() => update({ kind: k.value })}
                className="sr-only"
              />
              <span className={`block text-sm font-medium ${values.kind === k.value ? "text-accent" : "text-fg"}`}>
                {k.label}
              </span>
              <span className="mt-0.5 block text-xs text-fg-subtle">{k.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={single ? "" : "grid grid-cols-2 gap-4"}>
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted">{single ? "이벤트 날짜" : "시작일"}</label>
          <input type="date" required value={values.startDate} onChange={set("startDate")} className={inputClass} />
        </div>
        {!single && (
          <div>
            <label className="mb-1.5 block text-sm text-fg-muted">종료일</label>
            <input
              type="date"
              required
              min={values.startDate || undefined}
              value={values.endDate}
              onChange={set("endDate")}
              className={inputClass}
            />
          </div>
        )}
      </div>

      <fieldset className="rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg">게시 기간</legend>
        <p className="text-xs leading-relaxed text-fg-subtle">
          사이트에 이 게시물이 보이는 기간입니다(한국 시간). 게시 시작일은 오늘로, 게시 종료일은 이벤트 종료 다음날로 자동 입력되며 직접 바꿀 수 있습니다. 비워 두면 제한 없이 게시됩니다.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-fg-muted">게시 시작일</label>
            <input type="date" value={values.publishFrom} onChange={(e) => onChange({ ...values, publishFrom: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-fg-muted">게시 종료일</label>
            <input
              type="date"
              min={values.publishFrom || undefined}
              value={values.publishUntil}
              onChange={(e) => {
                setUntilTouched(true);
                onChange({ ...values, publishUntil: e.target.value });
              }}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setUntilTouched(false);
              const auto = nextDayAfterEvent(values);
              onChange({ ...values, publishUntil: auto ?? values.publishUntil });
            }}
            className="text-accent hover:underline"
          >
            이벤트 종료 다음날로 맞추기
          </button>
          <button
            type="button"
            onClick={() => {
              setUntilTouched(true);
              onChange({ ...values, publishFrom: "", publishUntil: "" });
            }}
            className="text-fg-muted hover:text-fg hover:underline"
          >
            기간 제한 없애기
          </button>
        </div>
      </fieldset>

      <label className="flex items-start gap-2.5 text-sm text-fg">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => onChange({ ...values, isPublished: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-border-strong accent-accent"
        />
        <span>
          {publishLabel}
          <span className="mt-0.5 block text-xs text-fg-subtle">
            꺼 두면 게시 기간과 상관없이 비공개입니다. 켜면 게시 기간 안에서만 보입니다.
          </span>
        </span>
      </label>
    </>
  );
}
