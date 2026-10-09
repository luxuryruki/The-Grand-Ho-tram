import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyReservationCreated } from "@/lib/notifications";
import { logAnalyticsEvent } from "@/lib/analytics";
import { getHotel, getRoom } from "@/data/hotels";
import { getVehicle } from "@/data/vehicles";
import { quoteStay } from "@/lib/pricing";
import { getRateBook } from "@/lib/rates";

const reservationSchema = z
  .object({
    hotelId: z.string().min(1),
    roomSlug: z.string().optional().nullable(),
    rateKey: z.string().optional().nullable(),
    checkIn: z.string().min(1),
    checkOut: z.string().min(1),
    guestCount: z.number().int().min(1).max(50),
    needsVehicle: z.boolean().default(false),
    /** 차량 id (src/data/vehicles) */
    vehicleType: z.string().optional().nullable(),
    pickupLocation: z.string().optional().nullable(),
    pickupDate: z.string().optional().nullable(),
    pickupTime: z.string().optional().nullable(),
    contactName: z.string().min(1),
    contactPhone: z.string().min(3),
    preferredChannel: z.enum(["TELEGRAM", "KAKAO"]).default("TELEGRAM"),
    source: z.string().optional().nullable(),
    utmSource: z.string().optional().nullable(),
    utmMedium: z.string().optional().nullable(),
    utmCampaign: z.string().optional().nullable(),
    sessionId: z.string().optional().nullable(),
  })
  .refine(
    (data) => new Date(data.checkOut).getTime() > new Date(data.checkIn).getTime(),
    { message: "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.", path: ["checkOut"] }
  )
  .superRefine((data, ctx) => {
    if (!data.needsVehicle) return;
    if (!data.vehicleType || !getVehicle(data.vehicleType)) {
      ctx.addIssue({ code: "custom", message: "차량 종류를 선택해주세요.", path: ["vehicleType"] });
    }
    if (!data.pickupTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.pickupTime)) {
      ctx.addIssue({ code: "custom", message: "픽업 시간을 입력해주세요.", path: ["pickupTime"] });
    }
    if (data.pickupDate && Number.isNaN(new Date(data.pickupDate).getTime())) {
      ctx.addIssue({ code: "custom", message: "픽업 날짜를 확인해주세요.", path: ["pickupDate"] });
    }
  });

/** 공개 예약 요청 생성 API. 인증이 필요하지 않습니다. */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 400 }
    );
  }

  const { sessionId, ...data } = parsed.data;
  const vehicle = data.needsVehicle && data.vehicleType ? getVehicle(data.vehicleType) : undefined;

  const hotel = getHotel(data.hotelId);
  if (!hotel) {
    return NextResponse.json({ error: "호텔을 선택해주세요." }, { status: 400 });
  }
  const room = data.roomSlug ? getRoom(hotel, data.roomSlug) : undefined;
  if (data.roomSlug && !room) {
    return NextResponse.json({ error: "객실을 다시 선택해주세요." }, { status: 400 });
  }

  // 프로모션 여부와 예상 요금은 클라이언트 값을 믿지 않고 DB 요금표로 서버에서 다시 계산합니다.
  const book = await getRateBook();
  const roomRates = room
    ? book.rates.filter((r) => r.hotelId === hotel.id && r.roomSlugs.includes(room.slug))
    : [];
  if (data.rateKey && roomRates.length > 0 && !roomRates.some((r) => r.rateKey === data.rateKey)) {
    return NextResponse.json({ error: "객실 구성을 다시 선택해주세요." }, { status: 400 });
  }
  const rate = roomRates.find((r) => r.rateKey === data.rateKey) ?? roomRates[0];
  const quote = rate
    ? quoteStay(
        { ...rate, label: rate.nameKo },
        data.checkIn,
        data.checkOut,
        new Set(book.holidays),
        book.info[hotel.id]?.validFrom
      )
    : null;

  const reservation = await prisma.reservationRequest.create({
    data: {
      hotelName: hotel.name,
      hotelId: hotel.id,
      roomSlug: room?.slug ?? null,
      roomName: room?.name ?? null,
      promoEligible: rate?.promo ?? false,
      rateKey: rate?.rateKey ?? null,
      nights: quote?.ok ? quote.nights : null,
      estimatedTotal: quote?.ok ? quote.total : null,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guestCount: data.guestCount,
      needsVehicle: data.needsVehicle,
      vehicleType: vehicle?.name.ko ?? null,
      pickupLocation: data.needsVehicle ? data.pickupLocation : null,
      pickupDate: data.needsVehicle ? (data.pickupDate || data.checkIn) : null,
      pickupTime: data.needsVehicle ? data.pickupTime : null,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      preferredChannel: data.preferredChannel,
      source: data.source ?? null,
      utmSource: data.utmSource ?? null,
      utmMedium: data.utmMedium ?? null,
      utmCampaign: data.utmCampaign ?? null,
    },
  });

  // 알림 발송은 실패해도 예약 자체는 이미 저장되었으므로 응답을 막지 않습니다.
  notifyReservationCreated({
    id: reservation.id,
    hotelName: reservation.hotelName,
    roomName: reservation.roomName,
    promoEligible: reservation.promoEligible,
    promoLabel: rate?.promo ? rate.nameKo : null,
    rateName: rate?.nameKo ?? null,
    nights: reservation.nights,
    estimatedTotal: reservation.estimatedTotal,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    guestCount: reservation.guestCount,
    needsVehicle: reservation.needsVehicle,
    vehicleType: reservation.vehicleType,
    pickupLocation: reservation.pickupLocation,
    pickupDate: reservation.pickupDate,
    pickupTime: reservation.pickupTime,
    contactName: reservation.contactName,
    contactPhone: reservation.contactPhone,
    preferredChannel: reservation.preferredChannel,
    source: reservation.source,
  }).catch((err) => console.error("[reservations] notify failed", err));

  logAnalyticsEvent("reservation_submit", {
    sessionId: sessionId ?? null,
    metadata: {
      reservationId: reservation.id,
      source: reservation.source,
      hotelId: reservation.hotelId,
      roomSlug: reservation.roomSlug,
      promoEligible: reservation.promoEligible,
      rateKey: reservation.rateKey,
      estimatedTotal: reservation.estimatedTotal,
    },
  }).catch(() => {});

  return NextResponse.json({ reservation }, { status: 201 });
}
