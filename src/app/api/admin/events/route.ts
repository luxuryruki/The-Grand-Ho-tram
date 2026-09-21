import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

const createEventSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isPublished: z.boolean().optional().default(false),
});

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
  const parsed = createEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const { title, description, startDate, endDate, isPublished } = parsed.data;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return NextResponse.json(
      { error: "시작일/종료일을 확인해주세요." },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      startDate: start,
      endDate: end,
      isPublished,
    },
    include: { images: true },
  });

  return NextResponse.json({ event }, { status: 201 });
}
