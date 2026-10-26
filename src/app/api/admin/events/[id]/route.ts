import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { deleteEventImageFile } from "@/lib/supabase";
import { eventPatchSchema, resolveEventDates, toKstDateInput } from "@/lib/events";

// 일부 필드만 보낼 수 있습니다(예: 목록의 공개/비공개 전환은 isPublished만). 날짜 관련 필드는 기존 값과 합쳐 다시 검증합니다.
const updateEventSchema = eventPatchSchema;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = updateEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const input = parsed.data;
  const resolved = resolveEventDates({
    kind: input.kind ?? existing.kind,
    startDate: input.startDate ?? existing.startDate.toISOString().slice(0, 10),
    endDate: input.endDate !== undefined ? input.endDate : existing.endDate.toISOString().slice(0, 10),
    isPublished: input.isPublished ?? existing.isPublished,
    publishFrom: input.publishFrom !== undefined ? input.publishFrom : toKstDateInput(existing.publishFrom) || null,
    publishUntil: input.publishUntil !== undefined ? input.publishUntil : toKstDateInput(existing.publishUntil) || null,
  });
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...resolved.data,
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ event });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // DB에서 이벤트를 지우기 전에 Storage 원본 파일도 best-effort로 정리합니다.
  await Promise.all(
    event.images.map((img: { url: string }) => deleteEventImageFile(img.url))
  );

  await prisma.event.delete({ where: { id } }); // EventImage는 onDelete: Cascade로 함께 삭제됩니다.

  return NextResponse.json({ ok: true });
}
