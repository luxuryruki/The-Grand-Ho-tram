import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const EXTERNAL_HREF = /^(https?:|mailto:|tel:)/;

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent-soft hover:shadow-[0_12px_32px_-8px_rgba(205,160,94,0.45)]",
  secondary:
    "bg-bg-elevated text-fg border border-border hover:border-border-strong hover:bg-bg-elevated-2",
  ghost: "text-fg-muted hover:text-fg hover:bg-bg-elevated",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

/** next-intl의 <Link>처럼 다른 링크 컴포넌트에 버튼 스타일만 입히고 싶을 때 사용 */
export function buttonClassName(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  target,
}: CommonProps & { href: string; target?: string }) {
  const cls = cn(base, variants[variant], sizes[size], className);

  // 절대 URL(카카오/왓츠앱 딥링크, mailto 등)은 로케일 prefix를 붙이면 안 되므로 일반 <a>로 처리합니다.
  if (EXTERNAL_HREF.test(href)) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cls}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} target={target} className={cls}>
      {children}
    </Link>
  );
}
