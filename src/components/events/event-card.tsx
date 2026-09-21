import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HoverLift } from "@/components/motion/hover-card";
import { formatDateRange } from "@/lib/utils";

export type EventCardData = {
  id: string;
  title: string;
  description: string;
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
  const cover = event.images[0]?.url;

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <HoverLift className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-elevated-2">
          {cover ? (
            <Image
              src={cover}
              alt={event.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-fg-subtle">
              <ImageOff size={28} />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="text-xs uppercase tracking-wide text-accent">
            {formatDateRange(event.startDate, event.endDate, locale)}
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
