// 베트남 공휴일 (요금표의 "Public Holiday" 요금이 적용되는 날짜).
// 실제 휴무일(대체 휴일 포함) 기준이며, DB(PublicHoliday)에 올려서 사용합니다: npm run db:seed-holidays
// 정부가 해마다 확정 발표하므로 "(잠정)" 표시가 있는 날짜는 공식 발표 후 확인해 주세요.

export type HolidaySeed = { date: string; ko: string; en: string };

export const VIETNAM_HOLIDAYS: HolidaySeed[] = [
  { date: "2026-01-01", ko: "신정", en: "New Year's Day" },
  { date: "2026-01-02", ko: "신정 추가 휴일", en: "New Year additional day off" },
  { date: "2026-02-16", ko: "뗏(설) 연휴 - 섣달그믐", en: "Tet holiday - Lunar New Year's Eve" },
  { date: "2026-02-17", ko: "뗏(설) 연휴 - 설날", en: "Tet holiday - Lunar New Year's Day" },
  { date: "2026-02-18", ko: "뗏(설) 연휴", en: "Tet holiday" },
  { date: "2026-02-19", ko: "뗏(설) 연휴", en: "Tet holiday" },
  { date: "2026-02-20", ko: "뗏(설) 연휴", en: "Tet holiday" },
  { date: "2026-04-26", ko: "훙 왕 기념일", en: "Hung Kings' Commemoration Day" },
  { date: "2026-04-27", ko: "훙 왕 기념일 대체 휴일", en: "Hung Kings' Commemoration Day (observed)" },
  { date: "2026-04-30", ko: "남부 해방기념일", en: "Reunification Day" },
  { date: "2026-05-01", ko: "노동절", en: "International Labour Day" },
  { date: "2026-09-01", ko: "국경일 연휴", en: "National Day holiday" },
  { date: "2026-09-02", ko: "국경일", en: "National Day" },

  { date: "2027-01-01", ko: "신정", en: "New Year's Day" },
  { date: "2027-02-05", ko: "뗏(설) 연휴 - 섣달그믐 (잠정)", en: "Tet holiday - Lunar New Year's Eve (provisional)" },
  { date: "2027-02-06", ko: "뗏(설) 연휴 - 설날 (잠정)", en: "Tet holiday - Lunar New Year's Day (provisional)" },
  { date: "2027-02-07", ko: "뗏(설) 연휴 (잠정)", en: "Tet holiday (provisional)" },
  { date: "2027-02-08", ko: "뗏(설) 연휴 (잠정)", en: "Tet holiday (provisional)" },
  { date: "2027-02-09", ko: "뗏(설) 연휴 (잠정)", en: "Tet holiday (provisional)" },
  { date: "2027-04-16", ko: "훙 왕 기념일", en: "Hung Kings' Commemoration Day" },
  { date: "2027-04-30", ko: "남부 해방기념일", en: "Reunification Day" },
  { date: "2027-05-01", ko: "노동절", en: "International Labour Day" },
  { date: "2027-05-03", ko: "노동절 대체 휴일 (잠정)", en: "International Labour Day (observed, provisional)" },
  { date: "2027-09-02", ko: "국경일 (잠정)", en: "National Day (provisional)" },
];
