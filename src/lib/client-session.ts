"use client";

const SESSION_STORAGE_KEY = "grand-session-id";

/**
 * 브라우저 탭 단위로 유지되는 익명 세션 ID.
 * AI 상담 세션, 예약 요청, 분석 이벤트(AnalyticsEvent)에서 공통으로 사용해
 * 하나의 방문 흐름을 느슨하게 연결할 수 있도록 합니다.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}
