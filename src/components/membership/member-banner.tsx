import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/button";

/** 홈 화면의 회원 전용 요금 안내 배너 */
export function MemberBanner() {
  const t = useTranslations("membership");
  return (
    <section className="border-t border-border py-14 sm:py-16">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-accent/5 to-transparent p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.3em] text-accent">
                <Crown size={14} />
                {t("bannerEyebrow")}
              </p>
              <h2 className="mt-3 break-keep text-2xl font-semibold text-fg sm:text-3xl">
                {t("bannerTitle")}
              </h2>
              <p className="mt-3 break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
                {t("bannerBody")}
              </p>
            </div>
            <LinkButton href="/inquiry?source=home" size="lg" className="shrink-0">
              {t("bannerCta")}
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
