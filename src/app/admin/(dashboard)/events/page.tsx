import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EVENT_KIND_LABEL, PUBLISH_STATE_LABEL, publishState, type PublishState } from "@/lib/events";
import { EventRowActions } from "./event-row-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "이벤트 관리" };

const STATE_STYLE: Record<PublishState, string> = {
  live: "bg-success/15 text-success",
  scheduled: "bg-accent/15 text-accent",
  ended: "bg-bg-elevated-2 text-fg-subtle",
  private: "bg-bg-elevated-2 text-fg-subtle",
};

const day = (d: Date, timeZone: string) => d.toLocaleDateString("ko-KR", { timeZone });

export default async function AdminEventsPage() {
  const now = new Date();
  const events = await prisma.event.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">이벤트 관리</h1>
          <p className="mt-1 text-sm text-fg-muted">
            이벤트/프로모션을 등록하고, 이벤트 날짜와 게시 기간을 따로 관리할 수 있습니다.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          <Plus size={16} />
          새 이벤트
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-bg-elevated text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="px-4 py-3">이미지</th>
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">이벤트 날짜</th>
              <th className="px-4 py-3">게시 기간</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-fg-muted">
                  등록된 이벤트가 없습니다.
                </td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <div className="h-12 w-16 overflow-hidden rounded-md bg-bg-elevated-2">
                    {event.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.images[0].url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="font-medium text-fg hover:text-accent"
                  >
                    {event.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  <span className="mb-1 block text-xs text-accent">{EVENT_KIND_LABEL[event.kind]}</span>
                  {event.kind === "SINGLE_DAY"
                    ? day(event.startDate, "UTC")
                    : `${day(event.startDate, "UTC")} ~ ${day(event.endDate, "UTC")}`}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {event.publishFrom || event.publishUntil
                    ? `${event.publishFrom ? day(event.publishFrom, "Asia/Seoul") : "제한 없음"} ~ ${
                        event.publishUntil ? day(event.publishUntil, "Asia/Seoul") : "제한 없음"
                      }`
                    : "항상"}
                </td>
                <td className="px-4 py-3">
                  {(() => {
                    const state = publishState(event, now);
                    return (
                      <span className={`rounded-full px-2.5 py-1 text-xs ${STATE_STYLE[state]}`}>
                        {PUBLISH_STATE_LABEL[state]}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-4 py-3">
                  <EventRowActions eventId={event.id} isPublished={event.isPublished} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
