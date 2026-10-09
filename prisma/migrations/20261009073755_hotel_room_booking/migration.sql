-- 호텔 타입 선택을 호텔 + 객실 선택으로 바꿉니다.
-- 기존 "hotelType" 값(예: 스탠다드)은 "hotelName"으로 그대로 보존됩니다.
ALTER TABLE "ReservationRequest" RENAME COLUMN "hotelType" TO "hotelName";

ALTER TABLE "ReservationRequest"
ADD COLUMN     "hotelId" TEXT,
ADD COLUMN     "roomSlug" TEXT,
ADD COLUMN     "roomName" TEXT,
ADD COLUMN     "promoEligible" BOOLEAN NOT NULL DEFAULT false;
