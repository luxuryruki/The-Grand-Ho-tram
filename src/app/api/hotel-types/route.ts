import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** 예약 폼에서 사용하는 공개 호텔 타입 목록 (활성화된 것만) */
export async function GET() {
  const hotelTypes = await prisma.hotelType.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }],
  });
  return NextResponse.json({ hotelTypes });
}
