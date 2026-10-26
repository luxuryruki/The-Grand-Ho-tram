import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CONSULT_ENABLED } from "@/lib/features";
import { publicEventWhere } from "@/lib/events";

export const dynamic = "force-dynamic";
export const metadata = { title: "대시보드" };

export default async function AdminDashboardPage() {
  const [totalEvents, publishedEvents, newReservations, totalReservations, consultSessions, newMemberships] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: publicEventWhere() }),
      prisma.reservationRequest.count({ where: { status: "NEW" } }),
      prisma.reservationRequest.count(),
      CONSULT_ENABLED ? prisma.consultationSession.count() : Promise.resolve(0),
      prisma.membershipInquiry.count({ where: { status: "NEW" } }),
    ]);

  const cards = [
    { label: "게시 중인 이벤트", value: publishedEvents, sub: `전체 ${totalEvents}개`, href: "/admin/events" },
    { label: "신규 예약 요청", value: newReservations, sub: `전체 ${totalReservations}건`, href: "/admin/reservations" },
    { label: "신규 문의", value: newMemberships, sub: "처리 대기", href: "/admin/memberships" },
    ...(CONSULT_ENABLED
      ? [{ label: "AI 상담 세션", value: consultSessions, sub: "누적", href: "/admin/consultations" }]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">대시보드</h1>
      <p className="mt-1 text-sm text-fg-muted">The Concierge Ho Tram 운영 현황을 한눈에 확인하세요.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
