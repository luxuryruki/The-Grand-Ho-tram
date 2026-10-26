import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * 아주 단순한 관리자 세션 구현.
 *
 * - 별도의 AdminUser 테이블/인증 라이브러리 없이, 환경변수(ADMIN_ID, ADMIN_PASSWORD)와
 *   로그인 폼 입력값을 서버에서 직접 비교합니다.
 * - 일치하면 서명된 JWT를 httpOnly 쿠키로 발급합니다. 이 쿠키만 있으면 관리자로 간주합니다.
 * - 보안 요구 수준이 높지 않은 내부 관리자 페이지 용도이므로 이 정도 구현으로 충분합니다.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12시간

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET 환경변수가 설정되지 않았거나 너무 짧습니다 (16자 이상 필요). .env 파일을 확인하세요."
    );
  }
  // 운영에서는 .env.example의 샘플 값이나 짧은 값으로 세션을 서명하지 못하게 합니다(누구나 세션을 위조할 수 있기 때문).
  if (process.env.NODE_ENV === "production" && (secret.length < 32 || /replace-with|change-me/i.test(secret))) {
    throw new Error("운영 환경의 SESSION_SECRET은 샘플 값이 아닌 32자 이상의 랜덤 문자열이어야 합니다. (생성: openssl rand -base64 48)");
  }
  return new TextEncoder().encode(secret);
}

export type AdminSessionPayload = {
  role: "admin";
  adminId: string;
};

export async function createAdminSessionToken(
  adminId: string
): Promise<string> {
  const secret = getSessionSecret();
  return new SignJWT({ role: "admin", adminId } satisfies AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" || typeof payload.adminId !== "string") {
      return null;
    }
    return { role: "admin", adminId: payload.adminId };
  } catch {
    return null;
  }
}

/** Server Action / Route Handler 안에서 로그인 세션 쿠키를 설정합니다. */
export async function setAdminSessionCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

/** 현재 요청의 관리자 세션을 확인합니다 (Route Handler / Server Component 용). */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
