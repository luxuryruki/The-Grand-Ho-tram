import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-bg">
      <Container className="flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="text-lg font-semibold tracking-[0.18em] text-fg">
            THE GRAND
          </div>
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
          <Link href="/events" className="hover:text-fg">
            {t("linkEvents")}
          </Link>
          <Link href="/reserve" className="hover:text-fg">
            {t("linkReserve")}
          </Link>
          <a href="mailto:hello@thegrand.example" className="hover:text-fg">
            hello@thegrand.example
          </a>
        </div>
      </Container>
      <Container className="border-t border-border py-6 text-xs text-fg-subtle">
        {t("copyright", { year: new Date().getFullYear() })}
      </Container>
    </footer>
  );
}
