"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useConsult } from "@/components/consult/consult-provider";
import { CONSULT_ENABLED, ENGLISH_ENABLED } from "@/lib/features";
import { BrandMark } from "./brand-mark";
import { Container } from "./container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/hotels", key: "hotels" },
  { href: "/golf", key: "golf" },
  { href: "/casino", key: "casino" },
  { href: "/events", key: "events" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const consult = useConsult();
  const [open, setOpen] = useState(false);

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          aria-label="The Concierge Ho Tram"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {t(item.key)}
            </Link>
          ))}
          {CONSULT_ENABLED && (
            <button
              type="button"
              onClick={consult.open}
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {t("consult")}
            </button>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/inquiry"
            className="rounded-full border border-accent px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-fg"
          >
            {t("inquiry")}
          </Link>
          {ENGLISH_ENABLED && <LocaleSwitch locale={locale} onSwitch={switchLocale} />}
        </div>

        <button
          type="button"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-fg md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
                >
                  {t(item.key)}
                </Link>
              ))}
              {CONSULT_ENABLED && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    consult.open();
                  }}
                  className="rounded-lg px-3 py-3 text-left text-sm text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
                >
                  {t("consult")}
                </button>
              )}
              <Link
                href="/inquiry"
                onClick={() => setOpen(false)}
                className="mx-3 mt-2 rounded-full border border-accent px-4 py-2.5 text-center text-sm font-medium text-accent"
              >
                {t("inquiry")}
              </Link>
              {ENGLISH_ENABLED && (
                <div className="mt-2 px-3">
                  <LocaleSwitch locale={locale} onSwitch={switchLocale} />
                </div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LocaleSwitch({
  locale,
  onSwitch,
}: {
  locale: string;
  onSwitch: (locale: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border p-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onSwitch(l)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors duration-200",
            locale === l
              ? "bg-accent text-accent-fg"
              : "text-fg-muted hover:text-fg"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
