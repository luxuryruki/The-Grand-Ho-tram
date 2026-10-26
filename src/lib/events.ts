import { z } from "zod";

// 이벤트 공통 규칙: 형태(기간/하루), 게시 기간 판정, 입력 검증. 게시 기간은 한국 시간(KST) 날짜 기준입니다.

export type EventKindValue = "PERIOD" | "SINGLE_DAY";

export const EVENT_KIND_LABEL: Record<EventKindValue, string> = {
  PERIOD: "기간",
  SINGLE_DAY: "날짜",
};

const KST = "+09:00";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 게시 시작일: 그 날 00:00(KST)부터 노출 */
export function kstDayStart(date: string): Date {
  return new Date(`${date}T00:00:00.000${KST}`);
}

/** 게시 종료일: 그 날 23:59:59(KST)까지 노출 */
export function kstDayEnd(date: string): Date {
  return new Date(`${date}T23:59:59.999${KST}`);
}

/** DB의 시각을 폼의 날짜 입력값(YYYY-MM-DD, KST)으로 바꿉니다. */
export function toKstDateInput(value: Date | null): string {
  if (!value) return "";
  return new Date(value.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 공개 페이지에 보여도 되는 이벤트 조건: 공개 스위치가 켜져 있고, 지금이 게시 기간 안일 것 */
export function publicEventWhere(now: Date = new Date()) {
  return {
    isPublished: true,
    AND: [
      { OR: [{ publishFrom: null }, { publishFrom: { lte: now } }] },
      { OR: [{ publishUntil: null }, { publishUntil: { gte: now } }] },
    ],
  };
}

export type PublishState = "private" | "scheduled" | "live" | "ended";

export const PUBLISH_STATE_LABEL: Record<PublishState, string> = {
  private: "비공개",
  scheduled: "게시 예정",
  live: "게시 중",
  ended: "게시 종료",
};

/** 관리자 목록에 보여줄 게시 상태 */
export function publishState(
  event: { isPublished: boolean; publishFrom: Date | null; publishUntil: Date | null },
  now: Date = new Date()
): PublishState {
  if (!event.isPublished) return "private";
  if (event.publishFrom && event.publishFrom > now) return "scheduled";
  if (event.publishUntil && event.publishUntil < now) return "ended";
  return "live";
}

const dateString = z.string().regex(DATE_RE, "날짜 형식을 확인해 주세요.");
/** 빈 문자열/null은 "지정 안 함"으로 취급합니다(변환은 resolveEventDates에서). */
const optionalDate = z.union([dateString, z.literal(""), z.null()]).optional();

// 기본값을 스키마에 넣지 않습니다: 부분 수정(PATCH)에서 보내지 않은 필드가 기본값으로 덮어써지면 안 되기 때문입니다.
const eventFields = z.object({
  title: z.string().trim().min(1, "제목을 입력해 주세요."),
  description: z.string().trim().min(1, "설명을 입력해 주세요."),
  kind: z.enum(["PERIOD", "SINGLE_DAY"]),
  startDate: dateString,
  /** 하루 이벤트는 보내지 않아도 됩니다(시작일과 같은 날로 저장) */
  endDate: optionalDate,
  isPublished: z.boolean(),
  publishFrom: optionalDate,
  publishUntil: optionalDate,
});

/** 새 이벤트 등록: 형태를 보내지 않으면 기간 이벤트, 공개 여부를 보내지 않으면 비공개 */
export const eventCreateSchema = eventFields
  .extend({ kind: eventFields.shape.kind.default("PERIOD"), isPublished: z.boolean().default(false) });

/** 이벤트 부분 수정: 보낸 필드만 바꿉니다. */
export const eventPatchSchema = eventFields.partial();

export type EventBody = z.infer<typeof eventCreateSchema>;

export type EventData = {
  kind: EventKindValue;
  startDate: Date;
  endDate: Date;
  isPublished: boolean;
  publishFrom: Date | null;
  publishUntil: Date | null;
};

/** 입력값을 검증하고 DB에 넣을 값으로 바꿉니다. */
export function resolveEventDates(
  body: Pick<EventBody, "kind" | "startDate" | "endDate" | "publishFrom" | "publishUntil" | "isPublished">
): { ok: true; data: EventData } | { ok: false; error: string } {
  const start = new Date(body.startDate);
  const end = body.kind === "SINGLE_DAY" ? start : new Date(body.endDate ?? "");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: body.kind === "SINGLE_DAY" ? "이벤트 날짜를 확인해 주세요." : "시작일과 종료일을 확인해 주세요." };
  }
  if (start > end) return { ok: false, error: "종료일은 시작일보다 같거나 늦어야 합니다." };

  const publishFrom = body.publishFrom ? kstDayStart(body.publishFrom) : null;
  const publishUntil = body.publishUntil ? kstDayEnd(body.publishUntil) : null;
  if (publishFrom && publishUntil && publishFrom > publishUntil) {
    return { ok: false, error: "게시 종료일은 게시 시작일보다 같거나 늦어야 합니다." };
  }

  return {
    ok: true,
    data: { kind: body.kind, startDate: start, endDate: end, isPublished: body.isPublished, publishFrom, publishUntil },
  };
}

/** 오늘 날짜(YYYY-MM-DD, 한국 시간). 게시 시작일 기본값에 씁니다. */
export function todayKst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * 공개 이벤트 정렬: 오늘 기준으로 가까운 날짜가 먼저 옵니다.
 * 1) 지금 진행 중인 이벤트(곧 끝나는 순) → 2) 앞으로 시작할 이벤트(곧 시작하는 순) → 3) 이미 끝난 이벤트(최근에 끝난 순)
 */
export function sortEventsByProximity<T extends { startDate: Date; endDate: Date }>(
  events: T[],
  today: string = todayKst()
): T[] {
  const t = Date.parse(today);
  const rank = (e: T): [number, number] => {
    const start = e.startDate.getTime();
    const end = e.endDate.getTime();
    if (end < t) return [2, t - end];
    if (start > t) return [1, start - t];
    return [0, end - t];
  };
  return [...events].sort((a, b) => {
    const [ga, ka] = rank(a);
    const [gb, kb] = rank(b);
    return ga - gb || ka - kb || a.startDate.getTime() - b.startDate.getTime();
  });
}
