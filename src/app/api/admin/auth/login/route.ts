import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSessionToken, setAdminSessionCookie } from "@/lib/session";

const bodySchema = z.object({
  id: z.string().min(1),
  password: z.string().min(1),
});

function timingSafeEqualStr(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    // 길이가 달라도 일정 시간이 걸리도록 더미 비교를 수행합니다.
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { id, password } = parsed.data;
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminId || !adminPassword) {
    return NextResponse.json(
      { error: "서버에 관리자 계정(ADMIN_ID/ADMIN_PASSWORD)이 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  const idMatches = timingSafeEqualStr(id, adminId);
  const passwordMatches = timingSafeEqualStr(password, adminPassword);

  if (!idMatches || !passwordMatches) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const token = await createAdminSessionToken(adminId);
  await setAdminSessionCookie(token);

  return NextResponse.json({ ok: true });
}
