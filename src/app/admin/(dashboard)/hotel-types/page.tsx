import { prisma } from "@/lib/prisma";
import { HotelTypeManager } from "./hotel-type-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "호텔 타입" };

export default async function AdminHotelTypesPage() {
  const hotelTypes = await prisma.hotelType.findMany({ orderBy: [{ order: "asc" }] });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-fg">호텔 타입 관리</h1>
      <p className="mt-1 text-sm text-fg-muted">
        예약 요청 폼에 노출되는 호텔 타입 옵션입니다 (예: 스탠다드 / 디럭스 / 스위트).
      </p>

      <HotelTypeManager
        initial={hotelTypes.map((h) => ({
          id: h.id,
          name: h.name,
          description: h.description,
          isActive: h.isActive,
        }))}
      />
    </div>
  );
}
