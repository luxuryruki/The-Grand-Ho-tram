"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function RoomGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const t = useTranslations("hotels");
  const [index, setIndex] = useState(0);
  const count = images.length;

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
  }

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-bg-elevated-2">
        <Image
          key={images[index]}
          src={images[index]}
          alt={t("galleryPhoto", { name, index: index + 1 })}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority={index === 0}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label={t("galleryPrev")}
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label={t("galleryNext")}
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-bg/70 px-3 py-1 text-xs text-fg backdrop-blur">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={t("galleryPhoto", { name, index: i + 1 })}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-elevated-2 ring-2 ring-offset-2 ring-offset-bg transition",
                i === index
                  ? "ring-accent"
                  : "opacity-70 ring-transparent hover:opacity-100"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 640px) 12vw, 25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
