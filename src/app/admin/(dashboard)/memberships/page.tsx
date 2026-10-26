import { prisma } from "@/lib/prisma";
import { ReservationStatusSelect } from "../reservations/reservation-status-select";

export const dynamic = "force-dynamic";
export const metadata = { title: "통합 문의" };

const CHANNEL_LABEL: Record<string, string> = {
  TELEGRAM: "텔레그램",
  KAKAO: "카카오톡",
};

export default async function AdminMembershipsPage() {
  const inquiries = await prisma.membershipInquiry.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">통합 문의</h1>
      <p className="mt-1 text-sm text-fg-muted">
        홈페이지 문의하기 폼으로 접수된 예약·회원가 안내 문의 목록입니다. 상태를 변경하면 즉시 반영됩니다.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border bg-bg-elevated text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="px-4 py-3">접수일</th>
              <th className="px-4 py-3">이름 · 연락처</th>
              <th className="px-4 py-3">선호 채널</th>
              <th className="px-4 py-3">문의 내용</th>
              <th className="px-4 py-3">유입경로</th>
              <th className="px-4 py-3">상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-fg-muted">
                  접수된 문의가 없습니다.
                </td>
              </tr>
            )}
            {inquiries.map((m) => (
              <tr key={m.id} className="border-b border-border align-top last:border-b-0">
                <td className="px-4 py-3 text-fg-muted">
                  {m.createdAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-fg">{m.name}</p>
                  <p className="text-xs text-fg-muted">{m.phone}</p>
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {CHANNEL_LABEL[m.preferredChannel] ?? m.preferredChannel}
                </td>
                <td className="max-w-xs whitespace-pre-wrap px-4 py-3 text-fg-muted">
                  {m.message ?? "-"}
                </td>
                <td className="px-4 py-3 text-fg-muted">{m.source ?? "-"}</td>
                <td className="px-4 py-3">
                  <ReservationStatusSelect
                    id={m.id}
                    status={m.status}
                    basePath="/api/admin/memberships"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
