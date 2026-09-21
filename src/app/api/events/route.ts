import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** 공개 이벤트 목록 조회. 인증 없이 접근 가능하며, 공개(isPublished=true) 이벤트만 노출합니다. */
export async function GET() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: [{ startDate: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ events });
}
