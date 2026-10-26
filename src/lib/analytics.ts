import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";

/**
 * 범용 사용자 행동 로그 기록 헬퍼. 실패해도 요청 자체를 막지 않도록
 * 항상 내부에서 에러를 잡아 로그만 남깁니다.
 */
export async function logAnalyticsEvent(
  eventType: string,
  options?: { sessionId?: string | null; metadata?: Prisma.InputJsonObject }
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        sessionId: options?.sessionId ?? null,
        metadata: options?.metadata ?? undefined,
      },
    });
  } catch (err) {
    console.error(`[analytics] failed to log "${eventType}"`, err);
  }
}
