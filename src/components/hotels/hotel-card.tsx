import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HoverLift } from "@/components/motion/hover-card";
import { hotelImageSrc, pickText, type Hotel } from "@/data/hotels";
import { formatVnd } from "@/lib/pricing";

export function HotelCard({
  hotel,
  locale,
  fromPrice,
}: {
  hotel: Hotel;
  locale: string;
  /** DB 요금표의 평일 1박 최저 요금(VND). 요금표가 없으면 null */
  fromPrice: number | null;
}) {
  const t = useTranslations("hotels");
  const p = useTranslations("pricing");

  return (
    <Link href={`/hotels/${hotel.id}`} className="group block h-full">
      <HoverLift className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-elevated-2">
          <Image
            src={hotelImageSrc(hotel.cover)}
            alt={hotel.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <p className="text-xs uppercase tracking-wide text-accent">
            {t("roomCount", { count: hotel.rooms.length })}
          </p>
          <h2 className="text-xl font-semibold text-fg">{hotel.name}</h2>
          <p className="break-keep text-sm leading-relaxed text-fg-muted">
            {pickText(hotel.tagline, locale)}
          </p>
          {fromPrice !== null && (
            <p className="mt-1 text-sm font-medium text-accent">
              {p("fromWeekday", { price: formatVnd(fromPrice) })}
            </p>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-accent transition-all duration-300 group-hover:gap-2.5">
            {t("viewRooms")}
            <ArrowRight size={16} />
          </span>
        </div>
      </HoverLift>
    </Link>
  );
}
