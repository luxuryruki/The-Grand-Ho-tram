import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "대시보드" };

export default async function AdminDashboardPage() {
  const [totalEvents, publishedEvents, newReservations, totalReservations, consultSessions] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.reservationRequest.count({ where: { status: "NEW" } }),
      prisma.reservationRequest.count(),
      prisma.consultationSession.count(),
    ]);

  const cards = [
    { label: "공개 이벤트", value: publishedEvents, sub: `전체 ${totalEvents}개`, href: "/admin/events" },
    { label: "신규 예약 요청", value: newReservations, sub: `전체 ${totalReservations}건`, href: "/admin/reservations" },
    { label: "AI 상담 세션", value: consultSessions, sub: "누적", href: "/admin/consultations" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">대시보드</h1>
      <p className="mt-1 text-sm text-fg-muted">THE GRAND 운영 현황을 한눈에 확인하세요.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-border bg-bg-elevated p-6 transition-colors hover:border-border-strong"
          >
            <p className="text-sm text-fg-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold text-fg">{c.value}</p>
            <p className="mt-1 text-xs text-fg-subtle">{c.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
