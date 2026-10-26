-- CreateTable
CREATE TABLE "MembershipInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferredChannel" "PreferredChannel" NOT NULL DEFAULT 'KAKAO',
    "message" TEXT,
    "source" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GolfRateSheet" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GolfRateSheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MembershipInquiry_status_createdAt_idx" ON "MembershipInquiry"("status", "createdAt");
