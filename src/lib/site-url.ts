/**
 * 사이트의 공개 주소(https://…). 링크 미리보기(Open Graph) 이미지처럼 절대 주소가 필요한 곳에 씁니다.
 * 우선순위: NEXT_PUBLIC_SITE_URL(도메인을 직접 지정) → Vercel 운영 주소 → Vercel 배포 주소 → 로컬.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !/localhost|127\.0\.0\.1/.test(explicit)) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(explicit || "http://localhost:3000");
}
