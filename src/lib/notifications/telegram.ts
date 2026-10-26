import { Bot } from "grammy";
import type {
  MembershipNotificationPayload,
  NotificationSender,
  ReservationNotificationPayload,
} from "./types";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function formatMessage(p: ReservationNotificationPayload) {
  const lines = [
    "🔔 새 예약 요청이 도착했습니다",
    "",
    `• 호텔: ${p.hotelName}`,
    `• 객실: ${p.roomName ?? "미정 (상담 후 결정)"}${p.rateName && p.rateName !== p.roomName ? ` / 구성: ${p.rateName}` : ""}`,
    p.promoEligible
      ? `• 🎁 프로모션 적용 가능 객실${p.promoLabel ? ` (${p.promoLabel})` : ""} — 상담 시 프로모션 안내 필요`
      : null,
    `• 체크인 → 체크아웃: ${formatDate(p.checkIn)} → ${formatDate(p.checkOut)}`,
    p.estimatedTotal
      ? `• 예상 요금(참고용, 확정 금액 아님): ${p.nights}박 ${new Intl.NumberFormat("en-US").format(p.estimatedTotal)} VND`
      : null,
    `• 인원: ${p.guestCount}명`,
    `• 차량: ${
      p.needsVehicle
        ? `필요 (${p.vehicleType ?? "-"} / 픽업: ${p.pickupDate ?? "-"} ${p.pickupTime ?? "-"} · ${p.pickupLocation ?? "-"})`
        : "불필요"
    }`,
    `• 연락처: ${p.contactName} / ${p.contactPhone}`,
    `• 선호 연락 수단: ${p.preferredChannel}`,
    p.source ? `• 유입 경로: ${p.source}` : null,
    `• 요청 ID: ${p.id}`,
  ].filter((line): line is string => Boolean(line));

  return lines.join("\n");
}

/**
 * grammY를 이용한 텔레그램 알림 발송.
 * bot.start() 없이 bot.api.sendMessage()만 호출하는 "서버리스" 사용 패턴입니다
 * (Route Handler 요청마다 새로 봇 인스턴스를 만들 필요는 없도록 캐싱합니다).
 */
export class TelegramNotificationSender implements NotificationSender {
  readonly channel = "telegram";
  private bot: Bot | null = null;

  private getBot(): Bot | null {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return null;
    if (!this.bot) {
      this.bot = new Bot(token);
    }
    return this.bot;
  }

  async sendReservationAlert(payload: ReservationNotificationPayload) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const bot = this.getBot();

    if (!bot || !chatId) {
      console.warn(
        "[notifications:telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 가 설정되지 않아 알림을 건너뜁니다."
      );
      return;
    }

    await bot.api.sendMessage(chatId, formatMessage(payload));
  }

  async sendMembershipAlert(payload: MembershipNotificationPayload) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const bot = this.getBot();
    if (!bot || !chatId) {
      console.warn(
        "[notifications:telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 가 설정되지 않아 알림을 건너뜁니다."
      );
      return;
    }
    const lines = [
      "🔔 새 문의가 도착했습니다",
      "",
      `• 이름 / 연락처: ${payload.name} / ${payload.phone}`,
      `• 선호 연락 수단: ${payload.preferredChannel}`,
      payload.message ? `• 문의 내용: ${payload.message}` : null,
      payload.source ? `• 유입 경로: ${payload.source}` : null,
      `• 문의 ID: ${payload.id}`,
    ].filter((line): line is string => Boolean(line));
    await bot.api.sendMessage(chatId, lines.join("\n"));
  }
}
