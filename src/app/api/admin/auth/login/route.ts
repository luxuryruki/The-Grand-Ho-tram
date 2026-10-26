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

/** 운영에서는 짧거나 샘플인 관리자 비밀번호로는 로그인할 수 없게 합니다. */
function isWeakAdminPassword(password: string) {
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  return password.length < 10 || !hasLetter || !hasDigit || /change-me|password|1234/i.test(password);
}

// 같은 IP에서 연달아 틀리면 잠시 막습니다. (서버 인스턴스별 메모리 기준의 간단한 제한입니다.)
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const record = failures.get(ip);
  if (record && Date.now() - record.first > LOCK_MS) failures.delete(ip);
  if ((failures.get(ip)?.count ?? 0) >= MAX_FAILURES) {
    return NextResponse.json(
      { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429 }
    );
  }

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

  if (process.env.NODE_ENV === "production" && isWeakAdminPassword(adminPassword)) {
    return NextResponse.json(
      { error: "관리자 비밀번호가 너무 약합니다. 서버 환경변수 ADMIN_PASSWORD를 영문과 숫자를 섞은 10자 이상 비밀번호로 바꿔 주세요." },
      { status: 500 }
    );
  }

  const idMatches = timingSafeEqualStr(id, adminId);
  const passwordMatches = timingSafeEqualStr(password, adminPassword);

  if (!idMatches || !passwordMatches) {
    const prev = failures.get(ip);
    failures.set(ip, { count: (prev?.count ?? 0) + 1, first: prev?.first ?? Date.now() });
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  failures.delete(ip);
  const token = await createAdminSessionToken(adminId);
  await setAdminSessionCookie(token);

  return NextResponse.json({ ok: true });
}
