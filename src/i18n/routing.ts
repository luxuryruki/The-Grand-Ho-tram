import { defineRouting } from "next-intl/routing";
import { ENGLISH_ENABLED } from "@/lib/features";

/**
 * Central i18n configuration.
 *
 * `locales`는 지금은 한국어(ko, 기본)와 영어(en)만 활성화되어 있습니다.
 * 이후 베트남어를 추가하려면:
 *   1. 아래 `locales` 배열에 "vi" 추가
 *   2. messages/vi.json 파일 생성 (messages/ko.json 구조 복사 후 번역)
 * 만으로 사이트 전체에 반영됩니다. 라우팅/네비게이션/폼 검증 메시지 등
 * 다른 코드는 이 파일의 `locales` 배열을 기준으로 동작합니다.
 */
export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  // 기본 로케일(ko)은 prefix 없이 "/", 그 외 로케일은 "/en"처럼 prefix가 붙습니다.
  localePrefix: "as-needed",
  // 한국어 전용 운영 중에는 브라우저 언어/쿠키로 /en 으로 보내지 않습니다.
  localeDetection: ENGLISH_ENABLED,
  localeCookie: {
    name: "NEXT_LOCALE",
  },
});

export type AppLocale = (typeof routing.locales)[number];
