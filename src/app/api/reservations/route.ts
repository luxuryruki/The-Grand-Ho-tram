import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyReservationCreated } from "@/lib/notifications";
import { logAnalyticsEvent } from "@/lib/analytics";

const reservationSchema = z
  .object({
    hotelType: z.string().min(1),
    checkIn: z.string().min(1),
    checkOut: z.string().min(1),
    guestCount: z.number().int().min(1).max(50),
    needsVehicle: z.boolean().default(false),
    vehicleType: z.string().optional().nullable(),
    pickupLocation: z.string().optional().nullable(),
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
  );

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

  const reservation = await prisma.reservationRequest.create({
    data: {
      hotelType: data.hotelType,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guestCount: data.guestCount,
      needsVehicle: data.needsVehicle,
      vehicleType: data.needsVehicle ? data.vehicleType : null,
      pickupLocation: data.needsVehicle ? data.pickupLocation : null,
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
    hotelType: reservation.hotelType,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    guestCount: reservation.guestCount,
    needsVehicle: reservation.needsVehicle,
    vehicleType: reservation.vehicleType,
    pickupLocation: reservation.pickupLocation,
    contactName: reservation.contactName,
    contactPhone: reservation.contactPhone,
    preferredChannel: reservation.preferredChannel,
    source: reservation.source,
  }).catch((err) => console.error("[reservations] notify failed", err));

  logAnalyticsEvent("reservation_submit", {
    sessionId: sessionId ?? null,
    metadata: { reservationId: reservation.id, source: reservation.source },
  }).catch(() => {});

  return NextResponse.json({ reservation }, { status: 201 });
}
