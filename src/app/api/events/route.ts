import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicEventWhere } from "@/lib/events";

/** 공개 이벤트 목록 조회. 인증 없이 접근 가능하며, 공개 스위치가 켜져 있고 게시 기간 안인 이벤트만 노출합니다. */
export async function GET() {
  const events = await prisma.event.findMany({
    where: publicEventWhere(),
    orderBy: [{ startDate: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ events });
}
