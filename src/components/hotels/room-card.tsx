import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { HoverLift } from "@/components/motion/hover-card";

export function RoomCard({
  href,
  name,
  thumb,
  summary,
  price,
}: {
  href: string;
  name: string;
  thumb: string;
  summary: string;
  price?: ReactNode;
}) {
  return (
    <Link href={href} className="group block h-full">
      <HoverLift className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-elevated-2">
          <Image
            src={thumb}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="text-lg font-semibold text-fg">{name}</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{summary}</p>
          {price && <div className="mt-auto pt-2">{price}</div>}
        </div>
      </HoverLift>
    </Link>
  );
}
