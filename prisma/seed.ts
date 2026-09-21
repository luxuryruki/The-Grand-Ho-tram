// tsx로 이 스크립트를 직접 실행할 때는 Next.js가 자동으로 해주는 .env 로딩이 없으므로,
// 가장 먼저 명시적으로 .env를 읽어야 합니다 (src/lib/prisma의 어댑터가 이 값을 사용합니다).
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding hotel types...");
  const hotelTypes = [
    { name: "스탠다드", description: "합리적인 가격의 기본형 객실", order: 0 },
    { name: "디럭스", description: "넓은 공간과 업그레이드된 전망", order: 1 },
    { name: "스위트", description: "최고급 라운지 및 프라이빗 서비스", order: 2 },
  ];
  for (const ht of hotelTypes) {
    await prisma.hotelType.upsert({
      where: { name: ht.name },
      update: { description: ht.description, order: ht.order, isActive: true },
      create: ht,
    });
  }

  console.log("Seeding sample events...");
  const now = new Date();
  const inDays = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  const sampleEvents = [
    {
      title: "[플레이스홀더] 여름 스페셜 프로모션",
      description:
        "실제 이벤트 콘텐츠로 교체해주세요. 관리자 대시보드 > 이벤트 관리에서 제목, 설명, 기간, 이미지를 자유롭게 수정할 수 있습니다.",
      startDate: inDays(-3),
      endDate: inDays(14),
      isPublished: true,
      images: [
        "https://picsum.photos/seed/grand-event-1/1200/800",
        "https://picsum.photos/seed/grand-event-1b/1200/800",
      ],
    },
    {
      title: "[플레이스홀더] 얼리버드 예약 혜택",
      description:
        "실제 이벤트 콘텐츠로 교체해주세요. 기간, 조건, 혜택 내용을 자유롭게 작성할 수 있습니다.",
      startDate: inDays(7),
      endDate: inDays(30),
      isPublished: true,
      images: ["https://picsum.photos/seed/grand-event-2/1200/800"],
    },
    {
      title: "[플레이스홀더] 비공개 초안 이벤트",
      description: "isPublished=false 예시입니다. 공개 페이지에는 노출되지 않습니다.",
      startDate: inDays(20),
      endDate: inDays(40),
      isPublished: false,
      images: [],
    },
  ];

  for (const evt of sampleEvents) {
    const { images, ...data } = evt;
    const created = await prisma.event.create({
      data: {
        ...data,
        images: {
          create: images.map((url, i) => ({ url, order: i })),
        },
      },
    });
    console.log(`  created event: ${created.title}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
