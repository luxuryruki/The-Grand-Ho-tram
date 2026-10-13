import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/session";
import { ENGLISH_ENABLED } from "@/lib/features";

// Next.js 16부터 `middleware.ts`는 `proxy.ts`로 이름이 바뀌었고, export 이름도
// `middleware` 대신 `proxy`를 사용합니다 (동작 자체는 동일).
// 이 파일 하나가 두 가지 역할을 겸합니다:
//   1. 공개 페이지(`/`, `/events`, ... )에 대한 next-intl 로케일 라우팅
//   2. `/admin/*` 페이지와 `/api/admin/*` 쓰기 API에 대한 관리자 세션 검증
//      (프로젝트당 proxy 파일은 하나만 허용되므로 여기서 함께 처리합니다)

const intlProxy = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) 관리자 대시보드 페이지 보호 (로그인 페이지 자체는 제외)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSessionToken(token);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2) 관리자 전용 쓰기 API 보호 (라우트 핸들러 내부에서도 다시 한 번 검증합니다)
  //    로그인/로그아웃 API는 세션이 없는 상태에서 호출되므로 보호 대상에서 제외합니다.
  const isAuthEndpoint =
    pathname === "/api/admin/auth/login" || pathname === "/api/admin/auth/logout";
  if (pathname.startsWith("/api/admin") && !isAuthEndpoint) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 3) 나머지 /api/* 는 공개 API이므로 로케일 라우팅 없이 그대로 통과
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 4) 영어 페이지를 닫아 둔 동안에는 /en 주소로 들어와도 한국어 페이지로 보냅니다.
  if (!ENGLISH_ENABLED && (pathname === "/en" || pathname.startsWith("/en/"))) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url);
  }

  // 5) 공개 페이지: next-intl 로케일 감지/리다이렉트
  return intlProxy(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
