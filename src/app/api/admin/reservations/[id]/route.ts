import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

const updateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "DONE", "CANCELED"]),
});

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
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 상태값입니다." }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservationRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ reservation });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
