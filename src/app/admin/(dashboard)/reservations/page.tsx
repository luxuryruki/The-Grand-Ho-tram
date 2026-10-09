import { prisma } from "@/lib/prisma";
import { ReservationStatusSelect } from "./reservation-status-select";

export const dynamic = "force-dynamic";
export const metadata = { title: "예약 요청" };

const CHANNEL_LABEL: Record<string, string> = {
  TELEGRAM: "텔레그램",
  KAKAO: "카카오톡",
};

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservationRequest.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">예약 요청</h1>
      <p className="mt-1 text-sm text-fg-muted">
        호텔·객실·차량 예약 요청 목록입니다. 「프로모션 적용 가능」 표시는 상담 시 프로모션 안내가 필요한 요청입니다. 상태를 변경하면 즉시 반영됩니다.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="border-b border-border bg-bg-elevated text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="px-4 py-3">접수일</th>
              <th className="px-4 py-3">연락처</th>
              <th className="px-4 py-3">호텔 · 객실</th>
              <th className="px-4 py-3">체크인~아웃</th>
              <th className="px-4 py-3">인원</th>
              <th className="px-4 py-3">예상 요금 (참고)</th>
              <th className="px-4 py-3">차량</th>
              <th className="px-4 py-3">선호 채널</th>
              <th className="px-4 py-3">유입경로</th>
              <th className="px-4 py-3">상태</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-fg-muted">
                  접수된 예약 요청이 없습니다.
                </td>
              </tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-b-0 align-top">
                <td className="px-4 py-3 text-fg-muted">
                  {r.createdAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-fg">{r.contactName}</p>
                  <p className="text-xs text-fg-muted">{r.contactPhone}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-fg-muted">{r.hotelName}</p>
                  <p className="text-xs text-fg-subtle">
                    {r.roomName ?? "객실 미정"}
                  </p>
                  {r.promoEligible && (
                    <span className="mt-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                      프로모션 적용 가능
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {r.checkIn.toLocaleDateString("ko-KR")} ~ {r.checkOut.toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3 text-fg-muted">{r.guestCount}명</td>
                <td className="px-4 py-3 text-fg-muted">
                  {r.estimatedTotal ? (
                    <>
                      <p className="text-fg">
                        {new Intl.NumberFormat("en-US").format(r.estimatedTotal)} VND
                      </p>
                      <p className="text-xs text-fg-subtle">{r.nights}박 · 확정 금액 아님</p>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {r.needsVehicle ? (
                    <span>
                      필요
                      {r.vehicleType ? ` · ${r.vehicleType}` : ""}
                      {r.pickupTime ? ` · ${r.pickupDate ?? "-"} ${r.pickupTime}` : ""}
                      {r.pickupLocation ? ` · ${r.pickupLocation}` : ""}
                    </span>
                  ) : (
                    "불필요"
                  )}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {CHANNEL_LABEL[r.preferredChannel] ?? r.preferredChannel}
                </td>
                <td className="px-4 py-3 text-fg-muted">{r.source ?? "-"}</td>
                <td className="px-4 py-3">
                  <ReservationStatusSelect id={r.id} status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
