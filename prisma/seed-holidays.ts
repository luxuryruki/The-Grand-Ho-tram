// 베트남 공휴일을 DB(PublicHoliday)에 올립니다. 여러 번 실행해도 안전합니다(날짜 기준 upsert).
//   npm run db:seed-holidays
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { VIETNAM_HOLIDAYS } from "../src/data/vietnam-holidays";

async function main() {
  for (const h of VIETNAM_HOLIDAYS) {
    const date = new Date(`${h.date}T00:00:00.000Z`);
    await prisma.publicHoliday.upsert({
      where: { date },
      create: { date, nameKo: h.ko, nameEn: h.en },
      update: { nameKo: h.ko, nameEn: h.en },
    });
  }
  console.log(`공휴일 ${VIETNAM_HOLIDAYS.length}일 저장 완료.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
