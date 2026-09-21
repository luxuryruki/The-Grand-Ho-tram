import { NextResponse } from "next/server";
import { z } from "zod";
import { logAnalyticsEvent } from "@/lib/analytics";

const schema = z.object({
  eventType: z.string().min(1),
  sessionId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/** 클라이언트에서 보내는 범용 이벤트 로그 (page_view 등). 인증이 필요하지 않습니다. */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await logAnalyticsEvent(parsed.data.eventType, {
    sessionId: parsed.data.sessionId,
    metadata: parsed.data.metadata,
  });

  return NextResponse.json({ ok: true });
}
