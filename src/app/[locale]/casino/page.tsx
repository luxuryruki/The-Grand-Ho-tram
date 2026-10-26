import Image from "next/image";
import { Check } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  CASINO_AREAS,
  CASINO_ENTRY,
  CASINO_FACTS,
  CASINO_GAMES,
  CASINO_HERO,
  CASINO_IMAGES,
  CASINO_IMAGE_ALTS,
  CASINO_LOCATION,
  casinoText,
} from "@/data/casino";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: casinoText(CASINO_HERO.title, locale),
    description: casinoText(CASINO_HERO.subtitle, locale),
  };
}

export default async function CasinoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = (v: Parameters<typeof casinoText>[0]) => casinoText(v, locale);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[62%]">
          <Image
            src={CASINO_IMAGES.hero}
            alt={t(CASINO_IMAGE_ALTS.hero)}
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/80 to-bg lg:hidden" />
          <div className="absolute inset-y-0 -left-0.5 right-0 hidden bg-gradient-to-r from-bg via-bg/55 to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <Container className="relative flex flex-col items-start gap-5 py-24 sm:py-32 lg:py-36">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              {CASINO_HERO.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="break-keep text-4xl font-semibold leading-[1.15] text-fg sm:text-5xl">
              {t(CASINO_HERO.title)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-2xl break-keep text-base leading-relaxed text-fg-muted sm:text-lg">
              {t(CASINO_HERO.subtitle)}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-border bg-bg-elevated/40">
        <Container>
          <dl className="grid grid-cols-2 gap-6 py-8 sm:py-10 lg:grid-cols-4">
            {CASINO_FACTS.map((fact) => (
              <div key={fact.label.en}>
                <dt className="text-xs uppercase tracking-wide text-fg-subtle">
                  {t(fact.label)}
                </dt>
                <dd className="mt-1.5 text-xl font-semibold text-fg sm:text-2xl">
                  {t(fact.value)}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(CASINO_GAMES.title)}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASINO_GAMES.items.map((game) => (
              <RevealItem key={game.en}>
                <div className="flex h-full items-center rounded-2xl border border-border bg-bg-elevated px-6 py-5">
                  <p className="text-base font-medium text-fg">{t(game)}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(CASINO_AREAS.title)}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {CASINO_AREAS.items.map((item) => (
              <RevealItem key={item.name.en}>
                <div className="h-full rounded-2xl border border-border bg-bg-elevated p-6">
                  <h3 className="text-lg font-semibold text-fg">{t(item.name)}</h3>
                  <p className="mt-3 break-keep text-sm leading-relaxed text-fg-muted">
                    {t(item.body)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(CASINO_LOCATION.title)}
            </h2>
            <p className="mt-6 break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
              {t(CASINO_LOCATION.body)}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(CASINO_ENTRY.title)}
            </h2>
            <ul className="mt-6 space-y-3">
              {CASINO_ENTRY.items.map((item) => (
                <li
                  key={item.en}
                  className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted sm:text-base"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span className="break-keep">{t(item)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
