import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma ORM 7부터 schema.prisma의 datasource에는 더 이상 url을 직접 쓸 수 없고,
// 런타임 PrismaClient는 드라이버 어댑터를 통해 연결해야 합니다.
// (CLI 쪽 마이그레이션/Studio 연결 정보는 prisma.config.ts에서 관리합니다.)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL 환경변수가 설정되어 있지 않습니다. .env 파일을 확인해주세요."
  );
}

const adapter = new PrismaPg({ connectionString });

// Next.js dev 환경에서 파일 변경마다 모듈이 다시 로드되면서 PrismaClient가
// 중복 생성되는 것을 막기 위한 표준 싱글턴 패턴입니다.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
