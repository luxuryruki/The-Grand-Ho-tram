"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 등장 방향. 기본은 아래에서 위로 살짝 올라오며 페이드인 */
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  /** 자식 요소들을 순차적으로 등장시키고 싶을 때 true */
  as?: "div" | "section" | "li";
};

const offset = 24;

function getVariants(direction: RevealProps["direction"]): Variants {
  const hidden: Record<string, number> = { opacity: 0 };
  if (direction === "up") hidden.y = offset;
  if (direction === "down") hidden.y = -offset;
  if (direction === "left") hidden.x = offset;
  if (direction === "right") hidden.x = -offset;

  return {
    hidden,
    visible: { opacity: 1, y: 0, x: 0 },
  };
}

/**
 * 스크롤로 뷰포트에 들어올 때 부드럽게 페이드인 + 슬라이드되는 래퍼.
 * 화면에 처음 들어올 때 한 번만 재생됩니다 (viewport once).
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={getVariants(direction)}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** 리스트 아이템을 순차적으로(stagger) 등장시키기 위한 컨테이너 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealProps["direction"];
}) {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction)}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
