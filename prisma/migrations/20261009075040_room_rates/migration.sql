-- AlterTable
ALTER TABLE "ReservationRequest" ADD COLUMN     "estimatedTotal" INTEGER,
ADD COLUMN     "nights" INTEGER,
ADD COLUMN     "rateKey" TEXT;

-- CreateTable
CREATE TABLE "RoomRate" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "rateKey" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "roomCodes" TEXT[],
    "roomSlugs" TEXT[],
    "weekday" INTEGER NOT NULL,
    "friday" INTEGER,
    "saturday" INTEGER NOT NULL,
    "publicHoliday" INTEGER NOT NULL,
    "promoEligible" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "validFrom" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelRateInfo" (
    "hotelId" TEXT NOT NULL,
    "extraBed" INTEGER,
    "bedAndBreakfastAdult" INTEGER,
    "breakfastChild" INTEGER,
    "serviceChargePercent" INTEGER NOT NULL DEFAULT 5,
    "taxPercent" INTEGER NOT NULL DEFAULT 8,
    "validFrom" DATE NOT NULL,
    "sourceFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelRateInfo_pkey" PRIMARY KEY ("hotelId")
);

-- CreateTable
CREATE TABLE "PublicHoliday" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "nameKo" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomRate_hotelId_sortOrder_idx" ON "RoomRate"("hotelId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RoomRate_hotelId_rateKey_key" ON "RoomRate"("hotelId", "rateKey");

-- CreateIndex
CREATE UNIQUE INDEX "PublicHoliday_date_key" ON "PublicHoliday"("date");
