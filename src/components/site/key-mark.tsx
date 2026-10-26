import { useId } from "react";

/** 컨시어지의 황금 열쇠 심볼. 단색 배경 위에서 금속 광택이 나도록 그라데이션을 사용합니다. */
export function KeyMark({ className }: { className?: string }) {
  const id = useId();
  const gold = `${id}-gold`;
  const shade = `${id}-shade`;

  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="The Concierge Ho Tram" className={className}>
      <defs>
        <linearGradient id={gold} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6e4ae" />
          <stop offset="0.35" stopColor="#d9b26b" />
          <stop offset="0.7" stopColor="#b98a3e" />
          <stop offset="1" stopColor="#e9cd8f" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <g transform="rotate(-45 32 32)">
        {/* 손잡이: 클로버(세 잎) 장식 고리 */}
        <g fill={`url(#${gold})`}>
          <circle cx="32" cy="16" r="9.6" />
          <circle cx="32" cy="5.6" r="4.6" />
          <circle cx="21.6" cy="16" r="4.6" />
          <circle cx="42.4" cy="16" r="4.6" />
          {/* 샤프트와 칼라 */}
          <path d="M29.6 25h4.8v31.4l-2.4 2.6l-2.4-2.6Z" />
          <rect x="26.4" y="27.6" width="11.2" height="3.4" rx="1.7" />
          <rect x="27.8" y="32.8" width="8.4" height="2.6" rx="1.3" />
          <rect x="26.4" y="37" width="11.2" height="3.4" rx="1.7" />
          {/* 비트(이빨) */}
          <path d="M34.4 45h6.2l2.2 1.8v3.6l-2.2 1.2h-6.2Z" />
          <path d="M34.4 53h4.4l1.8 1.4v2.2l-1.8 1.2h-4.4Z" />
        </g>
        {/* 안쪽 구멍과 음각 선 */}
        <circle cx="32" cy="16" r="4.4" fill="var(--color-bg)" />
        <circle cx="32" cy="16" r="7.4" fill="none" stroke="#17130a" strokeOpacity="0.3" strokeWidth="0.8" />
        <rect x="29.6" y="25" width="4.8" height="31" fill={`url(#${shade})`} />
      </g>
    </svg>
  );
}
