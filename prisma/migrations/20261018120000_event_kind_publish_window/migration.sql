-- CreateEnum
CREATE TYPE "EventKind" AS ENUM ('PERIOD', 'SINGLE_DAY');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "kind" "EventKind" NOT NULL DEFAULT 'PERIOD',
ADD COLUMN     "publishFrom" TIMESTAMP(3),
ADD COLUMN     "publishUntil" TIMESTAMP(3);
