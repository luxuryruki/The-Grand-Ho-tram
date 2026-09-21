import { TelegramNotificationSender } from "./telegram";
import type {
  NotificationSender,
  ReservationNotificationPayload,
} from "./types";

const senders: NotificationSender[] = [new TelegramNotificationSender()];

// 카카오 알림톡(솔라피 등)이나 다른 채널을 추가하려면:
//   1. NotificationSender를 구현한 클래스를 만들고 (예: src/lib/notifications/solapi.ts)
//   2. 아래 배열에 인스턴스를 추가하세요. 이후 로직은 변경할 필요가 없습니다.
// const senders: NotificationSender[] = [
//   new TelegramNotificationSender(),
//   new SolapiNotificationSender(),
// ];

/** 예약 요청 생성 시 등록된 모든 채널로 알림을 보냅니다. 한 채널이 실패해도 나머지는 계속 진행됩니다. */
export async function notifyReservationCreated(
  payload: ReservationNotificationPayload
) {
  const results = await Promise.allSettled(
    senders.map((sender) => sender.sendReservationAlert(payload))
  );

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `[notifications:${senders[i].channel}] 알림 발송 실패`,
        result.reason
      );
    }
  });
}

export type { NotificationSender, ReservationNotificationPayload };
