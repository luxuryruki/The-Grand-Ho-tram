import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** 공개 이벤트 상세 조회. 비공개 이벤트는 404로 응답합니다. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const event = await prisma.event.findFirst({
    where: { id, isPublished: true },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ event });
}
