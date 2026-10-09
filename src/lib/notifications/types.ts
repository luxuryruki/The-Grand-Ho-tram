export type ReservationNotificationPayload = {
  id: string;
  hotelName: string;
  roomName?: string | null;
  promoEligible: boolean;
  /** 프로모션 적용 객실 분류명 (운영팀 표 기준) */
  promoLabel?: string | null;
  /** 선택한 요금 구성 이름 (예: "1베드 발코니 레지던스") */
  rateName?: string | null;
  nights?: number | null;
  /** 서버가 계산한 대략적인 예상 요금(VND). 참고용이며 확정 금액이 아닙니다. */
  estimatedTotal?: number | null;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  needsVehicle: boolean;
  vehicleType?: string | null;
  pickupLocation?: string | null;
  pickupDate?: string | null;
  pickupTime?: string | null;
  contactName: string;
  contactPhone: string;
  preferredChannel: string;
  source?: string | null;
};

/**
 * 알림 채널 추상화. 새 채널(카카오 알림톡/솔라피 등)을 추가하려면 이 인터페이스를
 * 구현한 클래스를 만들고 `src/lib/notifications/index.ts`의 senders 배열에 추가하면 됩니다.
 */
export interface NotificationSender {
  readonly channel: string;
  sendReservationAlert(payload: ReservationNotificationPayload): Promise<void>;
}
