import { getSiteUrl } from "./site-url";

// 검색 결과에 보이는 제목·설명과 구조화 데이터를 만드는 공통 도구입니다.
// 요금, 평점, 후기처럼 확인되지 않은 정보는 넣지 않습니다.

/** 호텔의 한국어 표기(검색어와 같은 이름으로 안내). 공식 호텔명 그대로의 사실 표기입니다. */
export const HOTEL_KO_NAME: Record<string, string> = {
  intercontinental: "인터컨티넨탈 그랜드 호짬",
  holidayinn: "홀리데이 인 리조트 호짬 비치",
  ixora: "익소라 호짬",
};

export const SITE_NAME_KO = "더 컨시어지 호짬";

/** 설명 문구를 검색 결과에 맞는 길이로 자릅니다. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/** "/hotels" 같은 경로를 절대 주소(https://…)로 바꿉니다. */
export function absUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

/** 검색 결과의 경로 표시(빵부스러기)용 데이터 */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}
