import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ANTHROPIC_MODEL, buildConsultSystemPrompt, getAnthropicClient } from "@/lib/anthropic";
import { logAnalyticsEvent } from "@/lib/analytics";

const schema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
  locale: z.string().optional().default("ko"),
});

const MAX_HISTORY_MESSAGES = 20;

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return new Response("잘못된 요청입니다.", { status: 400 });
  }

  const { sessionId, message, locale } = parsed.data;
  const encoder = new TextEncoder();

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    const fallback =
      locale === "en"
        ? "The AI consult service is not configured yet (ANTHROPIC_API_KEY missing). Please contact us via the reservation form."
        : "AI 상담 기능이 아직 설정되지 않았습니다 (ANTHROPIC_API_KEY 누락). 예약 요청 폼으로 문의해주세요.";
    return new Response(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 세션이 없으면 새로 만들고, 있으면 그대로 사용 (started_at 유지)
  const session = await prisma.consultationSession.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId, locale },
  });

  const isFirstMessage =
    (await prisma.consultationMessage.count({ where: { sessionId: session.id } })) === 0;

  await prisma.consultationMessage.create({
    data: { sessionId: session.id, role: "USER", content: message },
  });

  if (isFirstMessage) {
    logAnalyticsEvent("consult_start", { sessionId }).catch(() => {});
  }
  logAnalyticsEvent("consult_message", { sessionId }).catch(() => {});

  const history = await prisma.consultationMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY_MESSAGES,
  });

  const anthropicMessages = history.map((m) => ({
    role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  let assistantText = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: ANTHROPIC_MODEL,
          max_tokens: 1024,
          system: buildConsultSystemPrompt(locale),
          messages: anthropicMessages,
        });

        anthropicStream.on("text", (delta: string) => {
          assistantText += delta;
          controller.enqueue(encoder.encode(delta));
        });

        await anthropicStream.finalMessage();
      } catch (err) {
        console.error("[consult] anthropic stream error", err);
        const fallback =
          locale === "en"
            ? "\n\nSorry, something went wrong. Please try again in a moment."
            : "\n\n죄송합니다, 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        assistantText += fallback;
        controller.enqueue(encoder.encode(fallback));
      } finally {
        controller.close();
        if (assistantText.trim()) {
          await prisma.consultationMessage
            .create({
              data: {
                sessionId: session.id,
                role: "ASSISTANT",
                content: assistantText,
              },
            })
            .catch((err) => console.error("[consult] failed to persist assistant message", err));
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
