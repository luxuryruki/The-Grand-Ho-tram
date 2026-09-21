import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "AI 상담 로그" };

export default async function AdminConsultationsPage() {
  const sessions = await prisma.consultationSession.findMany({
    orderBy: [{ startedAt: "desc" }],
    take: 100,
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">AI 상담 로그</h1>
      <p className="mt-1 text-sm text-fg-muted">
        방문자와 AI 컨시어지의 상담 세션 목록입니다.
      </p>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
        {sessions.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-fg-muted">
            상담 기록이 없습니다.
          </p>
        )}
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/admin/consultations/${s.sessionId}`}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-elevated-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">
                {s.messages[0]?.content || "(메시지 없음)"}
              </p>
              <p className="mt-1 text-xs text-fg-subtle">
                {s.startedAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })} ·{" "}
                {s._count.messages}개 메시지 · {s.locale ?? "-"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
