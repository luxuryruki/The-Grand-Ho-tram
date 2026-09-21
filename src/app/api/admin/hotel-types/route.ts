import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

const createSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const hotelTypes = await prisma.hotelType.findMany({ orderBy: [{ order: "asc" }] });
  return NextResponse.json({ hotelTypes });
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const last = await prisma.hotelType.findFirst({ orderBy: { order: "desc" } });

  try {
    const hotelType = await prisma.hotelType.create({
      data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
    });
    return NextResponse.json({ hotelType }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "이미 존재하는 이름입니다." },
      { status: 409 }
    );
  }
}
