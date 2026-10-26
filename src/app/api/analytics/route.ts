import { NextResponse } from "next/server";
import { z } from "zod";
import { logAnalyticsEvent } from "@/lib/analytics";

const schema = z.object({
  eventType: z.string().min(1),
  sessionId: z.string().optional().nullable(),
  // JSON으로 저장할 수 있는 값만 받고, 누구나 보낼 수 있는 API라서 크기를 제한합니다.
  metadata: z
    .record(z.string(), z.json())
    .refine((m) => JSON.stringify(m).length <= 2000, "metadata too large")
    .optional(),
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
