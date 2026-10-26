"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** 이벤트 카드를 가로로 넘겨 보는 슬라이더. 터치/트랙패드는 밀어서, 마우스는 좌우 버튼으로 넘깁니다. */
export function EventSlider({ children, className }: { children: ReactNode; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth;
    // 화면에 보이는 카드 수만큼 한 번에 넘깁니다.
    const visible = Math.max(1, Math.round((el.clientWidth + 24) / step));
    el.scrollBy({ left: dir * step * visible, behavior: "smooth" });
  }

  const btn =
    "absolute top-[40%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg/90 text-fg shadow-lg backdrop-blur transition-opacity hover:border-accent hover:text-accent sm:flex";

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        onScroll={update}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="w-[78%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">{child}</div>
        ))}
      </div>
      <button
        type="button"
        aria-label="이전 이벤트"
        onClick={() => scrollByPage(-1)}
        className={cn(btn, "-left-5", canPrev ? "opacity-100" : "pointer-events-none opacity-0")}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="다음 이벤트"
        onClick={() => scrollByPage(1)}
        className={cn(btn, "-right-5", canNext ? "opacity-100" : "pointer-events-none opacity-0")}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
