import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HoverLift } from "@/components/motion/hover-card";
import { useTranslations } from "next-intl";
import { formatEventDate } from "@/lib/utils";

export type EventCardData = {
  id: string;
  title: string;
  description: string;
  kind: "PERIOD" | "SINGLE_DAY";
  startDate: string | Date;
  endDate: string | Date;
  images: { url: string }[];
};

export function EventCard({
  event,
  locale,
}: {
  event: EventCardData;
  locale: string;
}) {
  const t = useTranslations("events");
  const cover = event.images[0]?.url;

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <HoverLift className="flex h-full flex-col overflow-hidden">
        {/* 포스터가 잘리지 않도록 세로로 긴 틀(3:4)에 전체를 맞춰 보여 줍니다. 비율이 다른 이미지는 남는 자리에 배경이 보입니다. */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-elevated-2">
          {cover ? (
            <Image
              src={cover}
              alt={event.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-contain transition-transform duration-500 ease-out hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-fg-subtle">
              <ImageOff size={28} />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-wide text-accent">
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium">
              {event.kind === "SINGLE_DAY" ? t("kindSingle") : t("kindPeriod")}
            </span>
            <span>{formatEventDate(event.kind, event.startDate, event.endDate, locale)}</span>
          </p>
          <h3 className="text-lg font-semibold text-fg">{event.title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {event.description}
          </p>
        </div>
      </HoverLift>
    </Link>
  );
}
