import { cn } from "@/lib/utils";
import { KeyMark } from "./key-mark";

/** 황금 열쇠 심볼 + 워드마크. 이미지 파일 없이 SVG와 텍스트로만 구성합니다. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <KeyMark className="h-11 w-11 shrink-0 sm:h-14 sm:w-14" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-base font-semibold tracking-[0.28em] text-fg sm:text-lg">
          THE CONCIERGE
        </span>
        <span className="mt-1.5 flex items-center gap-2 text-[10px] font-medium tracking-[0.5em] text-accent sm:text-[11px]">
          <span aria-hidden className="h-px w-5 bg-accent/60" />
          HO TRAM
        </span>
      </span>
    </span>
  );
}
