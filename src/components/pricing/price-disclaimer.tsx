import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** 가격을 보여주는 모든 곳에 함께 표시하는 안내 문구 (대략적인 참고용 금액이며 정확한 금액은 추후 확정) */
export function PriceDisclaimer({ className }: { className?: string }) {
  const t = useTranslations("pricing");
  return (
    <p className={cn("break-keep text-xs leading-relaxed text-fg-subtle", className)}>
      {t("disclaimer")}
    </p>
  );
}
