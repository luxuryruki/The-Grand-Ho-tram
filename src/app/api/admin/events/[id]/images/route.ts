import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { deleteEventImageFile, uploadEventImage } from "@/lib/supabase";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "이벤트를 찾을 수 없습니다." }, { status: 404 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "jpg, png, webp, gif 형식만 업로드할 수 있습니다." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "이미지 용량은 8MB 이하만 가능합니다." },
      { status: 400 }
    );
  }

  try {
    const url = await uploadEventImage(file, eventId);
    const lastImage = await prisma.eventImage.findFirst({
      where: { eventId },
      orderBy: { order: "desc" },
    });

    const image = await prisma.eventImage.create({
      data: {
        eventId,
        url,
        order: (lastImage?.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (err) {
    console.error("[admin/events/images] upload failed", err);
    return NextResponse.json(
      { error: "이미지 업로드 중 오류가 발생했습니다. Supabase Storage 설정을 확인해주세요." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageId } = await request.json().catch(() => ({ imageId: null }));
  if (!imageId || typeof imageId !== "string") {
    return NextResponse.json({ error: "imageId가 필요합니다." }, { status: 400 });
  }

  const image = await prisma.eventImage.findUnique({ where: { id: imageId } });
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteEventImageFile(image.url);
  await prisma.eventImage.delete({ where: { id: imageId } });

  return NextResponse.json({ ok: true });
}
