// 엑셀 요금표를 DB(RoomRate / HotelRateInfo)에 올립니다.
//   npm run db:import-rates                       → "hotel data/2026.Sep Casino rate.xlsx"
//   npm run db:import-rates -- <파일경로> --dry-run  → 저장 없이 검증만
//
// 읽는 곳: IC 시트 M~S열, HIR 시트 M~T열, IXR 시트 A~K열의 카지노 요금(서비스 요금·세금 포함 Nett, VND).
// 각 시트 왼쪽의 ITO 요금 블록은 사용하지 않습니다.
// 프로모션 적용 가능 여부는 "casino available type" 시트에 있는 객실로 판단합니다.
import "dotenv/config";
import { readSheet } from "read-excel-file/node";
import { prisma } from "../src/lib/prisma";
import { HOTELS } from "../src/data/hotels";
import { RATE_ROOM_MAP } from "./rate-room-map";

type Cell = string | number | boolean | Date | null | undefined;
type Sheet = Cell[][];

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FILE = args.find((a) => !a.startsWith("--")) ?? "hotel data/2026.Sep Casino rate.xlsx";

type HotelConfig = {
  id: string;
  sheet: string;
  /** casino available type 시트의 구역 제목 */
  casinoSection: string;
  desc: number;
  codes: number;
  ko: number;
  /** [weekday, friday | null, saturday, publicHoliday] 열 번호 (0부터) */
  rates: [number, number | null, number, number];
  headers: [string, string | null, string, string];
  /** 추가 인원 요금·메모를 찾을 열 범위 (이 범위 밖의 ITO 쪽 메모는 무시) */
  labelCols: [number, number];
};

const CONFIGS: HotelConfig[] = [
  {
    id: "intercontinental",
    sheet: "IC",
    casinoSection: "InterContinental Grand",
    desc: 12,
    codes: 13,
    ko: 14,
    rates: [15, 16, 17, 18],
    headers: ["Weekday", "Friday", "Saturday", "Public Holiday"],
    labelCols: [12, 25],
  },
  {
    id: "holidayinn",
    sheet: "HIR",
    casinoSection: "Holiday Inn Resort",
    desc: 12,
    codes: 13,
    ko: 16,
    rates: [17, null, 18, 19],
    headers: ["Weekday", null, "Saturday", "Public Holiday"],
    labelCols: [12, 30],
  },
  {
    id: "ixora",
    sheet: "IXR",
    casinoSection: "IXORA Ho Tram by Fusion",
    desc: 0,
    codes: 1,
    ko: 6,
    rates: [7, 8, 9, 10],
    headers: ["Weekday", "Friday", "Saturday", "Public Holiday"],
    labelCols: [0, 11],
  },
];

const text = (c: Cell) => (typeof c === "string" ? c.replace(/\s+/g, " ").trim() : "");
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function fail(msg: string): never {
  throw new Error(msg);
}

function parseEffectiveDate(value: Cell): Date {
  if (value instanceof Date) {
    return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  }
  const m = /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/.exec(text(value));
  if (!m) fail(`적용 시작일(Effective stay date)을 읽지 못했습니다: ${String(value)}`);
  const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(
    m[2].toLowerCase()
  );
  if (month < 0) fail(`월 이름을 읽지 못했습니다: ${m[2]}`);
  return new Date(Date.UTC(Number(m[3]), month, Number(m[1])));
}

/** label 정규식에 맞는 셀을 찾아 같은 행에서 그 오른쪽의 첫 값을 돌려줍니다. */
function findRight(sheet: Sheet, re: RegExp, [minCol, maxCol]: [number, number], want: "number" | "any") {
  for (const row of sheet) {
    for (let c = minCol; c <= Math.min(maxCol, row.length - 1); c++) {
      if (re.test(text(row[c]))) {
        for (let k = c + 1; k < row.length; k++) {
          const v = row[k];
          if (want === "number" ? typeof v === "number" : v !== null && v !== undefined && v !== "") return v;
        }
        return undefined;
      }
    }
  }
  return undefined;
}

function findNote(sheet: Sheet, re: RegExp, [minCol, maxCol]: [number, number]) {
  for (const row of sheet) {
    for (let c = minCol; c <= Math.min(maxCol, row.length - 1); c++) {
      const m = re.exec(text(row[c]));
      if (m) return m;
    }
  }
  return null;
}

async function main() {
  console.log(`파일: ${FILE}${DRY_RUN ? "  (dry-run: 저장하지 않음)" : ""}`);

  // 카지노 프로모션 적용 가능 객실 (한국어 객실명 기준)
  const casino = (await readSheet(FILE, "casino available type")) as Sheet;
  const eligible: Record<string, Set<string>> = {};
  for (const cfg of CONFIGS) {
    const start = casino.findIndex((r) => text(r[0]) === cfg.casinoSection);
    if (start < 0) fail(`casino available type 시트에서 "${cfg.casinoSection}" 구역을 찾지 못했습니다.`);
    const names = new Set<string>();
    for (let i = start + 2; i < casino.length; i++) {
      const name = text(casino[i][2]);
      if (!name) break;
      names.add(name);
    }
    eligible[cfg.id] = names;
  }

  const siteSlugs = new Map<string, Set<string>>(HOTELS.map((h) => [h.id, new Set(h.rooms.map((r) => r.slug))]));
  const summary: string[] = [];

  for (const cfg of CONFIGS) {
    const sheet = (await readSheet(FILE, cfg.sheet)) as Sheet;

    const headerRow = sheet.find((r) =>
      cfg.headers.every((h, i) => h === null || text(r[cfg.rates[i] as number]) === h)
    );
    if (!headerRow) fail(`${cfg.sheet}: 요금 열 머리글(${cfg.headers.filter(Boolean).join("/")})을 찾지 못했습니다. 시트 구조가 바뀌었는지 확인하세요.`);
    const headerIdx = sheet.indexOf(headerRow);

    const effective = findRight(sheet, /^Effective stay date/i, cfg.labelCols, "any");
    const validFrom = parseEffectiveDate(effective as Cell);

    const rows: {
      rateKey: string;
      nameEn: string;
      nameKo: string;
      roomCodes: string[];
      roomSlugs: string[];
      weekday: number;
      friday: number | null;
      saturday: number;
      publicHoliday: number;
      promoEligible: boolean;
      sortOrder: number;
    }[] = [];

    for (let i = headerIdx + 1; i < sheet.length; i++) {
      const row = sheet[i];
      const nameKo = text(row[cfg.ko]);
      if (nameKo === "Korean") continue;
      const [wd, fr, sa, ph] = cfg.rates.map((c) => (c === null ? null : row[c]));
      if (!nameKo) {
        if (rows.length > 0) break;
        continue;
      }
      const nums = [wd, sa, ph, ...(cfg.rates[1] === null ? [] : [fr])];
      if (nums.some((n) => typeof n !== "number" || !(n > 0))) {
        fail(`${cfg.sheet} ${i + 1}행 "${nameKo}": 요금 값이 숫자가 아닙니다 (${JSON.stringify([wd, fr, sa, ph])}).`);
      }
      const slugs = RATE_ROOM_MAP[cfg.id]?.[nameKo];
      if (!slugs) fail(`${cfg.sheet}: "${nameKo}" 객실이 prisma/rate-room-map.ts 에 없습니다. 사이트 객실 slug를 연결해 주세요.`);
      for (const s of slugs) {
        if (!siteSlugs.get(cfg.id)?.has(s)) fail(`rate-room-map.ts: ${cfg.id} 에 없는 객실 slug "${s}" ("${nameKo}")`);
      }
      const nameEn = text(row[cfg.desc]);
      if (!nameEn) fail(`${cfg.sheet} ${i + 1}행: 영문 객실명이 비어 있습니다.`);

      rows.push({
        rateKey: slugify(nameEn),
        nameEn,
        nameKo,
        roomCodes: text(row[cfg.codes]).split(",").map((c) => c.trim()).filter(Boolean),
        roomSlugs: slugs,
        weekday: Math.round(wd as number),
        friday: fr === null ? null : Math.round(fr as number),
        saturday: Math.round(sa as number),
        publicHoliday: Math.round(ph as number),
        promoEligible: eligible[cfg.id].has(nameKo),
        sortOrder: rows.length,
      });
    }

    if (new Set(rows.map((r) => r.rateKey)).size !== rows.length) fail(`${cfg.sheet}: 영문 객실명이 중복되어 rateKey가 겹칩니다.`);
    for (const name of eligible[cfg.id]) {
      if (!rows.some((r) => r.nameKo === name)) fail(`${cfg.sheet}: casino available type 의 "${name}" 가 요금표에 없습니다.`);
    }

    const extra = (re: RegExp) => {
      const v = findRight(sheet, re, cfg.labelCols, "number");
      return typeof v === "number" ? Math.round(v) : null;
    };
    const note = findNote(sheet, /Inclusive of (\d+)% service charge, (\d+)% tax/i, cfg.labelCols);
    const info = {
      extraBed: extra(/^Extra Bed only/i),
      bedAndBreakfastAdult: extra(/^Bed & B.?fast Adult/i),
      breakfastChild: extra(/^B.?fast Kid \(4-11/i),
      serviceChargePercent: note ? Number(note[1]) : 5,
      taxPercent: note ? Number(note[2]) : 8,
      validFrom,
      sourceFile: FILE.split("/").pop() ?? FILE,
    };

    summary.push(
      `${cfg.id.padEnd(17)} 요금 ${String(rows.length).padStart(2)}행 (프로모션 ${rows.filter((r) => r.promoEligible).length}) · 적용 ${validFrom
        .toISOString()
        .slice(0, 10)} · 서비스 ${info.serviceChargePercent}% 세금 ${info.taxPercent}% · 추가인원 ${info.extraBed}/${info.bedAndBreakfastAdult}/${info.breakfastChild} · 사이트 미연결: ${
        rows.filter((r) => r.roomSlugs.length === 0).map((r) => r.nameKo).join(", ") || "-"
      }`
    );

    if (DRY_RUN) continue;

    await prisma.$transaction(async (tx) => {
      for (const r of rows) {
        await tx.roomRate.upsert({
          where: { hotelId_rateKey: { hotelId: cfg.id, rateKey: r.rateKey } },
          create: { hotelId: cfg.id, validFrom, ...r },
          update: { validFrom, ...r },
        });
      }
      const removed = await tx.roomRate.deleteMany({
        where: { hotelId: cfg.id, rateKey: { notIn: rows.map((r) => r.rateKey) } },
      });
      if (removed.count) console.log(`  (${cfg.id}: 새 요금표에 없는 ${removed.count}행 삭제)`);
      await tx.hotelRateInfo.upsert({
        where: { hotelId: cfg.id },
        create: { hotelId: cfg.id, ...info },
        update: info,
      });
    });
  }

  console.log(summary.join("\n"));
  console.log(DRY_RUN ? "검증 완료 (저장 안 함)." : "DB 저장 완료.");
}

main()
  .catch((e) => {
    console.error("가져오기 실패:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
