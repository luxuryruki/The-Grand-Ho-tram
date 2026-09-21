export type ReservationNotificationPayload = {
  id: string;
  hotelType: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  needsVehicle: boolean;
  vehicleType?: string | null;
  pickupLocation?: string | null;
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
