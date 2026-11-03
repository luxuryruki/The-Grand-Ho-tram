/** 운영 도메인(대표 주소). 도메인을 바꾸면 여기와 Vercel의 대표 도메인을 함께 바꾸세요. */
export const PRODUCTION_SITE_URL = "https://www.theconciergehotram.com";

/**
 * 사이트의 공개 주소(https://…). 링크 미리보기(Open Graph) 이미지, 사이트맵처럼 절대 주소가 필요한 곳에 씁니다.
 * 우선순위: NEXT_PUBLIC_SITE_URL(직접 지정) → 운영 환경이면 운영 도메인 → Vercel 배포 주소 → 로컬.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !/localhost|127\.0\.0\.1/.test(explicit)) return new URL(explicit);
  if (process.env.VERCEL_ENV === "production") return new URL(PRODUCTION_SITE_URL);
  const vercel = process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(explicit || "http://localhost:3000");
}
