import type { Localized } from "./hotels/types";

// 더 블러프스 그랜드 호짬 골프 클럽 소개. 내용은 공식 사이트(thebluffshotram.com) 기준이며,
// 확인되지 않은 수치(파, 총 야드, 개장 연도, 그린피 등)는 넣지 않았습니다.

export function golfText(value: Localized, locale: string): string {
  return value[locale as keyof Localized] ?? value.en;
}

export const GOLF_IMAGES = {
  hero: "/golf/hero.webp",
  sunset: "/golf/sunset.webp",
  hole12: "/golf/hole12.webp",
  hole18: "/golf/hole18.webp",
  bunker: "/golf/bunker.webp",
  towers: "/golf/towers.webp",
};

export const GOLF_HERO = {
  eyebrow: "THE BLUFFS GRAND HO TRAM",
  title: {
    ko: ["바다와 사구 위에 펼쳐진", "링크스 골프"],
    en: ["True links golf among", "the dunes and the sea"],
  } as Record<"ko" | "en", string[]>,
  subtitle: {
    ko: "전설적인 골퍼 그렉 노먼이 설계한 18홀 링크스 코스. 호짬 해안의 거대한 모래 언덕을 따라, 라운드 내내 바다를 바라보며 플레이합니다.",
    en: "An 18-hole links course designed by golf legend Greg Norman, routed over the coastal dunes of Ho Tram with ocean views throughout the round.",
  },
};

export const GOLF_FACTS: { label: Localized; value: Localized }[] = [
  { label: { ko: "홀 수", en: "Holes" }, value: { ko: "18홀", en: "18 holes" } },
  { label: { ko: "코스 스타일", en: "Style" }, value: { ko: "링크스", en: "Links" } },
  { label: { ko: "코스 설계", en: "Designer" }, value: { ko: "그렉 노먼", en: "Greg Norman" } },
  { label: { ko: "위치", en: "Location" }, value: { ko: "호짬 해안", en: "Ho Tram coast" } },
];

export const GOLF_OVERVIEW = {
  title: { ko: "코스 소개", en: "The course" },
  paragraphs: [
    {
      ko: "더 블러프스 그랜드 호짬은 링크스 골프의 본질을 담아 설계된 코스입니다. 거의 모든 위대한 링크스 코스가 그렇듯 해안선을 따라 자리하며, 수천 년 동안 바람이 빚어 온 거대한 모래 언덕 위와 사이를 넘나들며 코스가 이어집니다.",
      en: "The Bluffs Grand Ho Tram was designed to capture the true essence of links golf. Like almost every great links course it sits on the coastline, and the routing runs over and around towering sand dunes shaped by the elements over thousands of years.",
    },
    {
      ko: "이곳에서는 바람이 라운드의 중요한 변수입니다. 시기에 따라 주된 방향과 세기가 달라, 같은 홀도 찾을 때마다 다른 표정을 보여 줍니다.",
      en: "Wind plays a major role here. Its prevailing direction and strength change with the time of year, so the same hole can play differently every time you return.",
    },
    {
      ko: "코스를 설계한 그렉 노먼은 세계 랭킹 1위에 331주 동안 머물렀고 디 오픈 챔피언십에서 두 차례 우승한 골퍼입니다. 그는 지금까지 작업한 부지 가운데 이만큼 특별한 땅은 아일랜드 두베그(Doonbeg)와 이곳 두 곳뿐이라고 말했습니다.",
      en: "Designer Greg Norman spent 331 weeks at the top of the world rankings and won the Open Championship twice. He has said this is one of only two pieces of land of this quality he has worked with, the other being Doonbeg in Ireland.",
    },
  ] as Localized[],
};

export const GOLF_AWARDS = {
  title: { ko: "수상 및 평가", en: "Recognition" },
  items: [
    { ko: "Golf Digest 세계 100대 골프 코스 2024 · 68위", en: "Golf Digest World's 100 Greatest Golf Courses 2024 · No. 68" },
    { ko: "Golf Digest 세계 100대 골프 코스 2022 · 65위", en: "Golf Digest World's 100 Greatest Golf Courses 2022 · No. 65" },
    { ko: "2024 동남아시아 최고의 골프 코스 · World Luxury Travel Awards", en: "Best Golf Course in Southeast Asia 2024 · World Luxury Travel Awards" },
    { ko: "2023 아시아 최고의 골프 코스 · World Luxury Travel Awards", en: "Asia's Best Golf Course 2023 · World Luxury Travel Awards" },
    { ko: "2023 베트남 최고의 골프 코스 · World Golf Awards", en: "Vietnam's Best Golf Course 2023 · World Golf Awards" },
  ] as Localized[],
};

export const GOLF_PRACTICE = {
  title: { ko: "드라이빙 레인지 & 쇼트게임 에어리어", en: "Driving range & short-game area" },
  body: {
    ko: "3,000㎡ 규모에 길이 400야드로 이어지는 드라이빙 레인지는 천연 잔디 티와 타깃 그린, 벙커를 갖춰 실제 코스에서 치는 듯한 감각을 줍니다. 소음이 닿지 않는 조용한 곳에 있어 모든 수준의 골퍼가 필요한 샷을 충분히 연습할 수 있습니다.",
    en: "The 3,000 sqm driving range stretches 400 yards, with natural grass tees, target greens and bunkers that make you feel as if you are on the course. Set in a quiet corner of the property, it lets players of every level practise every shot they will need.",
  },
  bullets: [
    { ko: "40야드·50야드 티 그라운드", en: "40- and 50-yard tee grounds" },
    { ko: "연습용 벙커", en: "Practice bunker" },
    { ko: "여러 개의 칩핑 에어리어", en: "Multiple chipping areas" },
    { ko: "음료 키오스크, 요청 시 음식 배달", en: "Refreshment kiosk, food delivered on request" },
  ] as Localized[],
};

export const GOLF_CLUBHOUSE = {
  title: { ko: "클럽하우스 & 시설", en: "Clubhouse & facilities" },
  items: [
    {
      name: { ko: "인피니티 레스토랑", en: "Infinity Restaurant" },
      body: {
        ko: "호짬 해안과 끝없이 펼쳐진 그린이 내려다보이는 레스토랑입니다. 베트남 전통 요리부터 인터내셔널 메뉴까지, 가볍게도 든든하게도 즐길 수 있습니다.",
        en: "A restaurant overlooking the Ho Tram coastline and endless greens, serving everything from traditional Vietnamese dishes to international favourites, whether you want a quick bite or a full meal.",
      },
    },
    {
      name: { ko: "레어 캐스크 룸", en: "Rare Cask Room" },
      body: {
        ko: "최대 15명까지 모일 수 있는 프라이빗 공간입니다. 40종이 넘는 스카치 위스키와 미식을 곁들이며 라운드 후의 시간을 보낼 수 있습니다.",
        en: "An intimate private space for up to 15 guests, with more than 40 varieties of scotch and whisky paired with gourmet cuisine after your round.",
      },
    },
    {
      name: { ko: "프로숍", en: "Pro Shop" },
      body: {
        ko: "주요 브랜드의 최신 장비와 블러프스 로고 의류를 갖추고 있으며, 렌털 클럽도 운영합니다. 프로숍은 더 그랜드 호짬 스트립 1층(메인 로비에서 도보 거리)과 클럽하우스 1층에 있습니다.",
        en: "Stocked with the latest equipment from major brands and Bluffs-logo apparel, plus rental clubs. Pro shops are on the ground level of The Grand Ho Tram Strip, a short walk from the main lobby, and on the ground floor of the Clubhouse.",
      },
    },
    {
      name: { ko: "락커룸", en: "Locker Room" },
      body: {
        ko: "남성 락커룸에는 풀사이즈 락커 143개와 샤워 시설 18개가 있고, 여성 락커룸에는 풀사이즈 락커와 메이크업 부스, 개별 탈의 부스가 마련돼 있습니다. 별도 출입이 가능한 VIP 락커룸과 전용 다이닝 공간도 있습니다.",
        en: "The men's side has 143 full-length lockers and 18 showers; the women's side has full-length lockers, a make-up stall and private changing booths. A VIP locker room offers private access with separate dining and casual spaces.",
      },
    },
    {
      name: { ko: "연회장", en: "Banquet Room" },
      body: {
        ko: "웨딩 리셉션부터 라운드 후 시상식까지 폭넓게 쓸 수 있는 연회장입니다. 클럽하우스 최상층의 1,000㎡ 데크는 해발 50m가 넘는 높이에서 석양을 감상하기 좋습니다.",
        en: "As versatile as it is spacious, from wedding receptions to post-round awards. The 1,000 sqm deck on the top level of the Clubhouse sits more than 50 metres above sea level, ideal for sunsets.",
      },
    },
  ] as { name: Localized; body: Localized }[],
};

export const GOLF_UI = {
  galleryTitle: { ko: "갤러리", en: "Gallery" },
  imageAlts: {
    hero: { ko: "클럽하우스와 바다가 보이는 블러프스 항공 전경", en: "Aerial view of The Bluffs with the clubhouse and the sea" },
    sunset: { ko: "석양이 지는 링크스 코스", en: "The links course at sunset" },
    hole12: { ko: "12번 홀 항공 전경", en: "Aerial view of hole 12" },
    hole18: { ko: "18번 홀 페어웨이와 클럽하우스", en: "Hole 18 fairway and the clubhouse" },
    bunker: { ko: "사구 사이의 벙커", en: "A bunker among the dunes" },
    towers: { ko: "그랜드 호짬 타워가 보이는 그린", en: "A green with The Grand Ho Tram towers behind" },
  } as Record<string, Localized>,
};
