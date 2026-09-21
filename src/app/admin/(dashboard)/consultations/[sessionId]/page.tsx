import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const session = await prisma.consultationSession.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/consultations"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft size={15} />
        상담 로그 목록
      </Link>

      <h1 className="mt-4 text-xl font-semibold text-fg">상담 세션</h1>
      <p className="mt-1 text-xs text-fg-subtle">
        세션 ID: {session.sessionId} · 시작:{" "}
        {session.startedAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })} · 로케일:{" "}
        {session.locale ?? "-"}
      </p>

      <div className="mt-6 space-y-3 rounded-2xl border border-border bg-bg-elevated p-5">
        {session.messages.length === 0 && (
          <p className="text-sm text-fg-muted">메시지가 없습니다.</p>
        )}
        {session.messages.map((m: { id: string; role: string; content: string }) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
              m.role === "USER"
                ? "ml-auto bg-accent text-accent-fg"
                : "bg-bg-elevated-2 text-fg"
            )}
          >
            {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
