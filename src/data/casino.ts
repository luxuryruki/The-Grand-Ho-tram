import type { Localized } from "./hotels/types";

// 더 그랜드 호짬 카지노 시설 정보. 운영사 공식 사이트에서 확인되는 사실(위치, 규모, 운영 시간, 테이블/게임기 수,
// 게임 종류, 입장 조건)만 담았고, 혜택·프로모션·VIP 서비스 내용·이용 권유 문구는 넣지 않습니다.

export function casinoText(value: Localized, locale: string): string {
  return value[locale as keyof Localized] ?? value.en;
}

export const CASINO_HERO = {
  eyebrow: "THE GRAND HO TRAM",
  title: { ko: "카지노 시설 안내", en: "Casino facility information" },
  subtitle: {
    ko: "베트남 최초의 복합리조트 카지노로, 더 그랜드 호짬 안에 자리하고 있습니다. 그 규모와 게임 종류 등 시설 정보를 소개합니다.",
    en: "Vietnam's first international integrated resort casino, located within The Grand Ho Tram complex. This page introduces the facility, including its size and the games on offer.",
  },
};

export const CASINO_FACTS: { label: Localized; value: Localized; note?: Localized }[] = [
  { label: { ko: "게이밍 면적", en: "Gaming area" }, value: { ko: "5,000㎡ 이상", en: "5,000+ sqm" } },
  { label: { ko: "테이블 게임", en: "Table games" }, value: { ko: "약 90개", en: "About 90" } },
  { label: { ko: "전자 게임기", en: "Electronic gaming machines" }, value: { ko: "500대 이상", en: "500+" } },
  { label: { ko: "운영 시간", en: "Opening hours" }, value: { ko: "24시간 연중무휴", en: "24 hours, every day" } },
];

export const CASINO_GAMES = {
  title: { ko: "게임 종류", en: "Games" },
  items: [
    { ko: "텍사스 홀덤 포커", en: "Texas Hold'em Poker" },
    { ko: "유러피안 룰렛", en: "European Roulette" },
    { ko: "바카라", en: "Baccarat" },
    { ko: "블랙잭", en: "Blackjack" },
    { ko: "식보", en: "Sic Bo" },
    { ko: "슬롯 & 전자 테이블 게임", en: "Slots & electronic table games" },
  ] as Localized[],
};

export const CASINO_AREAS = {
  title: { ko: "구성", en: "Layout" },
  items: [
    {
      name: { ko: "일반 게이밍 구역", en: "Mass gaming area" },
      body: {
        ko: "약 2,936㎡ 규모의 메인 카지노 플로어입니다. 라이브 테이블 게임과 전자 게임기가 함께 운영됩니다.",
        en: "A main casino floor of about 2,936 sqm, with live table games and electronic gaming machines.",
      },
    },
    {
      name: { ko: "VIP 게이밍 구역", en: "VIP gaming area" },
      body: {
        ko: "약 2,500㎡ 규모로, VIP 고객을 위한 전용 구역(VIP 룸, 펄 룸)이 별도로 마련돼 있습니다.",
        en: "About 2,500 sqm, with separate areas reserved for VIP guests, including the VIP Room and the Pearl Room.",
      },
    },
    {
      name: { ko: "8 드래곤즈 레스토랑", en: "8 Dragons restaurant" },
      body: {
        ko: "메인 카지노 플로어 안에 있는 레스토랑으로, 아시안 퓨전 뷔페와 일품요리 메뉴를 운영합니다.",
        en: "A restaurant on the main casino floor serving an Asian-fusion buffet and an à la carte menu.",
      },
    },
  ] as { name: Localized; body: Localized }[],
};

export const CASINO_LOCATION = {
  title: { ko: "위치", en: "Location" },
  body: {
    ko: "베트남 호치민시 호짬(Ho Tram)의 더 그랜드 호짬 단지 안에 있습니다. 호치민 시내에서 차로 약 2시간 거리이며, 인터컨티넨탈 그랜드 호짬과 홀리데이 인 리조트 호짬 비치, 익소라 호짬이 같은 단지에 있습니다.",
    en: "Inside The Grand Ho Tram complex in Ho Tram, Ho Chi Minh City, Vietnam, about two hours by road from the city centre. InterContinental Grand Ho Tram, Holiday Inn Resort Ho Tram Beach and Ixora Ho Tram are in the same complex.",
  },
};

export const CASINO_ENTRY = {
  title: { ko: "입장 안내", en: "Entry" },
  items: [
    { ko: "외국인 고객은 만 18세 이상이어야 합니다.", en: "Foreign guests must be 18 years of age or older." },
    {
      ko: "원본 유효 여권과 비자만 확인 서류로 인정되며, 입장 전에 제시해야 합니다.",
      en: "Only original, valid passports and visas are accepted as proof of eligibility and must be presented before entry.",
    },
  ] as Localized[],
};

// 사진은 Pexels(상업적 사용 가능, 출처 표기 선택)의 무료 이미지이며 시설 실제 모습이 아닌 분위기를 보여 주는 참고 이미지입니다.
export const CASINO_IMAGES = {
  hero: "/casino/hero.webp",
};

export const CASINO_IMAGE_ALTS: Record<keyof typeof CASINO_IMAGES, Localized> = {
  hero: { ko: "슬롯 머신이 늘어선 카지노 플로어 (참고 이미지)", en: "A casino floor lined with slot machines (illustrative image)" },
};
