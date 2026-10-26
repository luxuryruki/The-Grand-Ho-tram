import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** 요금이 보이는 곳에 붙이는 안내: 모든 요금은 회원가로 안내해 드립니다. */
export function MemberNotice({ className }: { className?: string }) {
  const t = useTranslations("membership");
  return (
    <div
      className={cn(
        "rounded-xl border border-accent/40 bg-gradient-to-r from-accent/15 via-accent/5 to-transparent px-4 py-3.5",
        className
      )}
    >
      <p className="flex items-center gap-2.5 break-keep text-sm font-medium tracking-wide text-fg">
        <Crown size={16} className="shrink-0 text-accent" />
        {t("notice")}
      </p>
    </div>
  );
}
