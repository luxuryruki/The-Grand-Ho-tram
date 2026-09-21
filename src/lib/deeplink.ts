/**
 * 예약 요청 제출 후 "바로 문의하기" 딥링크 유틸.
 *
 * - WhatsApp은 `text` 쿼리 파라미터로 메시지를 미리 채울 수 있습니다.
 * - 카카오톡 채널 / Zalo는 공식적으로 딥링크에 텍스트를 미리 채우는 방법이 없어서,
 *   요약 텍스트를 클립보드에 복사한 뒤 채팅방을 열어주는 방식으로 대체합니다
 *   (버튼 클릭 시 handleCopyAndOpen 참고: src/app/[locale]/reserve/success-actions.tsx).
 */

export type ReservationSummaryInput = {
  hotelType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  needsVehicle: boolean;
  vehicleType?: string | null;
  pickupLocation?: string | null;
  contactName: string;
  contactPhone: string;
};

export function buildReservationSummaryText(
  r: ReservationSummaryInput,
  locale: string
) {
  const isKo = locale === "ko";
  const lines = isKo
    ? [
        "[THE GRAND 예약 문의]",
        `- 호텔 타입: ${r.hotelType}`,
        `- 체크인~체크아웃: ${r.checkIn} ~ ${r.checkOut}`,
        `- 인원: ${r.guestCount}명`,
        r.needsVehicle
          ? `- 차량: 필요 (${r.vehicleType || "-"} / 픽업: ${r.pickupLocation || "-"})`
          : "- 차량: 불필요",
        `- 이름: ${r.contactName}`,
        `- 연락처: ${r.contactPhone}`,
      ]
    : [
        "[THE GRAND Reservation Inquiry]",
        `- Hotel type: ${r.hotelType}`,
        `- Check-in ~ Check-out: ${r.checkIn} ~ ${r.checkOut}`,
        `- Guests: ${r.guestCount}`,
        r.needsVehicle
          ? `- Vehicle: needed (${r.vehicleType || "-"} / pickup: ${r.pickupLocation || "-"})`
          : "- Vehicle: not needed",
        `- Name: ${r.contactName}`,
        `- Phone: ${r.contactPhone}`,
      ];
  return lines.join("\n");
}

export function buildKakaoChatUrl(): string | null {
  const id = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID;
  if (!id) return null;
  return `https://pf.kakao.com/${id}/chat`;
}

export function buildWhatsappUrl(summary: string): string | null {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(summary)}`;
}

export function buildZaloUrl(): string | null {
  const phone = process.env.NEXT_PUBLIC_ZALO_PHONE;
  if (!phone) return null;
  return `https://zalo.me/${phone}`;
}
