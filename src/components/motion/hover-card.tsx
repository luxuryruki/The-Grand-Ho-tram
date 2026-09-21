"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * hover 시 살짝 떠오르는(lift) + 그림자가 짙어지는 카드 래퍼.
 * 이벤트 카드, 요금/옵션 카드 등에서 재사용합니다.
 */
export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-border bg-bg-elevated",
        className
      )}
      whileHover={{ y: -6, boxShadow: "0 24px 60px -16px rgba(0,0,0,0.55)" }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
