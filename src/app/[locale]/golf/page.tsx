import Image from "next/image";
import { Check } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  GOLF_AWARDS,
  GOLF_CLUBHOUSE,
  GOLF_FACTS,
  GOLF_HERO,
  GOLF_IMAGES,
  GOLF_OVERVIEW,
  GOLF_PRACTICE,
  GOLF_UI,
  golfText,
} from "@/data/golf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";
  return {
    title: isKo ? "더 블러프스 골프" : "The Bluffs Golf",
    description: golfText(GOLF_HERO.subtitle, locale),
  };
}

export default async function GolfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = (v: Parameters<typeof golfText>[0]) => golfText(v, locale);
  const alt = (key: keyof typeof GOLF_UI.imageAlts) => t(GOLF_UI.imageAlts[key]);
  const title = GOLF_HERO.title[locale === "ko" ? "ko" : "en"];

  const gallery = ["sunset", "hole12", "hole18", "bunker"] as const;

  return (
    <div>
      {/* Hero: 우측 사진, 좌측으로 흐려지는 그라데이션 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[68%]">
          <Image
            src={GOLF_IMAGES.hero}
            alt={alt("hero")}
            fill
            priority
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/80 to-bg lg:hidden" />
          <div className="absolute inset-y-0 -left-0.5 right-0 hidden bg-gradient-to-r from-bg via-bg/55 to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <Container className="relative flex flex-col items-start gap-6 py-24 sm:py-32 lg:py-40">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              {GOLF_HERO.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-2xl break-keep text-4xl font-semibold leading-[1.15] text-fg sm:text-5xl lg:text-6xl">
              {title[0]}
              <br />
              {title[1]}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg break-keep text-base leading-relaxed text-fg-muted sm:text-lg">
              {t(GOLF_HERO.subtitle)}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Key facts */}
      <section className="border-y border-border bg-bg-elevated/40">
        <Container>
          <dl className="grid grid-cols-2 gap-6 py-8 sm:py-10 lg:grid-cols-4">
            {GOLF_FACTS.map((fact) => (
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

      {/* Overview */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(GOLF_OVERVIEW.title)}
            </h2>
            <div className="mt-6 space-y-5">
              {GOLF_OVERVIEW.paragraphs.map((p) => (
                <p
                  key={p.en}
                  className="break-keep text-sm leading-relaxed text-fg-muted sm:text-base"
                >
                  {t(p)}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-elevated-2">
              <Image
                src={GOLF_IMAGES.towers}
                alt={alt("towers")}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Recognition */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(GOLF_AWARDS.title)}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOLF_AWARDS.items.map((item) => (
              <RevealItem key={item.en}>
                <div className="h-full rounded-2xl border border-border bg-bg-elevated p-5">
                  <p className="break-keep text-sm leading-relaxed text-fg">{t(item)}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Gallery */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(GOLF_UI.galleryTitle)}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {gallery.map((key) => (
              <RevealItem key={key}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-bg-elevated-2">
                  <Image
                    src={GOLF_IMAGES[key]}
                    alt={alt(key)}
                    fill
                    sizes="(min-width: 1152px) 540px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Practice */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(GOLF_PRACTICE.title)}
            </h2>
            <p className="mt-6 break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
              {t(GOLF_PRACTICE.body)}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-3 rounded-2xl border border-border bg-bg-elevated p-6">
              {GOLF_PRACTICE.bullets.map((b) => (
                <li key={b.en} className="flex items-start gap-3 text-sm text-fg-muted sm:text-base">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  {t(b)}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Clubhouse */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
              {t(GOLF_CLUBHOUSE.title)}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {GOLF_CLUBHOUSE.items.map((item) => (
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
    </div>
  );
}
