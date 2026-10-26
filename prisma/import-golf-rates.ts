// 골프 요금표(JSON)를 DB(GolfRateSheet)에 올립니다. 요금 숫자는 저장소에 두지 않고 기본적으로
// "hotel data/golf-rates.json"(커밋 제외 폴더)에서 읽습니다.
//   npm run db:import-golf-rates                    → hotel data/golf-rates.json
//   npm run db:import-golf-rates -- <경로> --dry-run → 저장 없이 검증만
import "dotenv/config";
import fs from "node:fs";
import { prisma } from "../src/lib/prisma";
import { golfSheetSchema } from "../src/lib/golf-schema";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FILE = args.find((a) => !a.startsWith("--")) ?? "hotel data/golf-rates.json";

async function main() {
  const parsed = golfSheetSchema.safeParse(JSON.parse(fs.readFileSync(FILE, "utf8")));
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n"));
  }
  const sheet = parsed.data;
  console.log(
    `파일: ${FILE}${DRY_RUN ? " (dry-run)" : ""}\n적용 기간 ${sheet.validFrom} ~ ${sheet.validTo} · 특정일 ${sheet.days.length}일 · 18홀 평일/주말/공휴일 ${sheet.greenFees.weekday["18"]}/${sheet.greenFees.weekend["18"]}/${sheet.greenFees.holiday["18"]}`
  );
  if (DRY_RUN) return console.log("검증 완료 (저장 안 함).");
  await prisma.golfRateSheet.upsert({
    where: { id: "current" },
    create: { id: "current", data: sheet },
    update: { data: sheet },
  });
  console.log("DB 저장 완료.");
}

main()
  .catch((e) => {
    console.error("가져오기 실패:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
