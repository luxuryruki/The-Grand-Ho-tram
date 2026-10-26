import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "./brand-mark";
import { Container } from "./container";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-bg">
      <Container className="flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <BrandMark />
          <p className="mt-4 text-xs font-medium tracking-[0.18em] text-accent">{t("tagline")}</p>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-fg-muted">
          <Link href="/hotels" className="hover:text-fg">
            {t("linkHotels")}
          </Link>
          <Link href="/golf" className="hover:text-fg">
            {t("linkGolf")}
          </Link>
          <Link href="/casino" className="hover:text-fg">
            {t("linkCasino")}
          </Link>
          <Link href="/events" className="hover:text-fg">
            {t("linkEvents")}
          </Link>
          <Link href="/inquiry" className="hover:text-fg">
            {t("linkInquiry")}
          </Link>
        </div>
      </Container>
      <Container className="space-y-2 border-t border-border py-6 text-xs text-fg-subtle">
        <p className="break-keep leading-relaxed">{t("independent")}</p>
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      </Container>
    </footer>
  );
}
