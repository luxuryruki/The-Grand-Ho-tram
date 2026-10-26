import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { eventCreateSchema, resolveEventDates } from "@/lib/events";

/** 관리자용 전체 이벤트 목록 (비공개 포함). proxy.ts + 여기서 이중으로 세션을 검증합니다. */
export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = eventCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const resolved = resolveEventDates(parsed.data);
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      ...resolved.data,
    },
    include: { images: true },
  });

  return NextResponse.json({ event }, { status: 201 });
}
