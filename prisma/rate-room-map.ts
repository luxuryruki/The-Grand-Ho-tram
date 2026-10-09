// 요금표(엑셀)의 한국어 객실명 → 사이트 객실 slug(src/data/hotels) 연결표.
// 새 요금표에 이 표에 없는 객실이 나오면 가져오기 스크립트가 오류를 내므로, 여기에 추가해 주세요.
// 빈 배열은 "요금표에는 있지만 사이트에 소개하는 객실이 없음"을 뜻합니다.

export const RATE_ROOM_MAP: Record<string, Record<string, string[]>> = {
  intercontinental: {
    "클래식 오션/골프뷰": [
      "2-twin-beds-classic-ocean-view",
      "2-twin-beds-classic",
      "1-king-bed-classic-ocean-view",
      "1-king-bed-classic",
    ],
    "클래식 그랜드 골프뷰": [
      "2-twin-beds-classic-grand-golf-view",
      "1-king-bed-classic-grand-golf-view",
    ],
    "클래식 그랜드 오션뷰": [
      "2-twin-beds-classic-grand-ocean-view",
      "1-king-bed-classic-grand-ocean-view",
    ],
    "주니어스위트": ["1-king-junior-suite-ocean-view"],
    "스위트 골프뷰": ["1-king-1-bedroom-suite-golf-view"],
    "스위트 오션뷰": ["1-king-1-bedroom-suite-ocean-view"],
    "스위트 그랜드 골프뷰": ["1-king-1-bedroom-suite-grand-golf-view"],
    "스위트 그랜드 오션뷰": ["1-king-1-bedroom-suite-grand-ocean-view"],
    "로얄스위트": ["1-king-2-single-2-bedroom-royal-suite"],
    "임페리어 스위트": [],
  },
  holidayinn: {
    "스탠다드": ["standard-room"],
    "스탠다드 카바나": ["standard-cabana-forest-view"],
    "스탠다드 오션뷰": [
      "standard-ocean-view-one-king-bed",
      "standard-ocean-view-two-single-beds",
    ],
    "스탠다드 오션뷰 카바나": ["standard-cabana-smk-ocean-view"],
    "키즈스위트": ["1-king-1-bunk-family-suite-forest-view"],
    "스위트": ["1-king-bed-suite"],
    "스위트 카바나": ["1-king-bed-suite-cabana-smk"],
    "그랜드 스위트": ["1-king-bed-1-bedroom-suite-smk"],
    "패밀리 스위트": ["2-bedroom-suite-marine-theme-forest-view"],
    "패밀리 스위트 카바나": ["2-bedroom-suite-marine-theme-cabana-smk"],
    "패밀리스위트 오션뷰": ["2-bedroom-suite-marine-theme-ocean-view"],
    "투베드 스위트": ["2-bedroom-suite-ocean-view"],
    "투베드 스위트 카바나": ["2-bedroom-suite-cabana-smk-ocean-view"],
    "디럭스 스위트 투베드룸": ["1-king-2-single-2-bedroom-blue-suite-sea-view"],
    "프리미엄 스위트 투베드룸": ["1-king-2-single-2-bedroom-presidential-suite"],
  },
  ixora: {
    "1베드 발코니 레지던스": ["residences-balcony-garden-view"],
    "2베드 발코니 레지던스": ["residences-balcony-garden-view"],
    "1베드 디럭스 발코니 레지던스": ["residences-ocean-view"],
    "2베드 디럭스 발코니 레지던스 오션뷰": ["residences-ocean-view"],
    "1베드 발코니 레지던스 가든 풀": ["residences-garden-pool"],
    "2베드 발코니 레지던스 가든 풀": ["residences-garden-pool"],
    "2베드 스카이블 펜트하우스 오션뷰": ["skypool-penthouse-ocean-view"],
    "2베드 파노라마 펜트하우스": ["panorama-penthouse"],
    "1베드 가든 풀 빌라": ["villa-garden-pool"],
    "2베드 가든 풀 빌라": ["villa-garden-pool"],
    "2베드 빌라 with 풀": ["villa-garden-pool"],
    "3베드 듀플렉스 가든 풀 빌라": ["duplex-villa-garden-pool"],
    "3베드 비치 풀 빌라": ["beach-pool-villa"],
    "1베드 오션프론트 풀빌라": ["oceanfront-villa"],
    "2베드 오션프론트 풀빌라": ["oceanfront-villa"],
    "3베드 오션프론드 풀 빌라": ["oceanfront-villa"],
  },
};
