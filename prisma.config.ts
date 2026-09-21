import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma ORM 7부터 datasource url은 schema.prisma가 아니라 이 파일에서 관리합니다.
// (마이그레이션/Studio 등 CLI 명령이 이 파일을 사용합니다. 런타임 PrismaClient는
// src/lib/prisma.ts에서 별도로 @prisma/adapter-pg를 통해 연결합니다.)
//
// `prisma generate`는 DB에 실제로 연결하지 않으므로 DATABASE_URL이 없어도 동작해야
// 합니다. (예: `.env`를 아직 만들지 않은 상태로 `npm install`을 처음 실행하는 경우.)
// prisma/config의 `env()` 헬퍼는 값이 없으면 즉시 예외를 던지기 때문에, 여기서는
// 대신 `process.env.DATABASE_URL`을 그대로 넘깁니다 — 값이 없으면 `undefined`가
// 되고, `migrate`/`db push`/`studio`처럼 실제로 연결이 필요한 명령을 실행할 때만
// Prisma가 그 시점에 명확한 에러를 보여줍니다.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
