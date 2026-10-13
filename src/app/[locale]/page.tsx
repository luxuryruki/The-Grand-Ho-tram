import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { LinkButton, buttonClassName } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { EventCard } from "@/components/events/event-card";
import { prisma } from "@/lib/prisma";
import { HighlightIcon } from "@/components/home/highlight-icon";

// 이벤트 목록이 관리자 대시보드에서 실시간으로 바뀌므로 매 요청마다 새로 렌더링합니다.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: [{ startDate: "desc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 3,
  });

  const highlights = t.raw("highlights.items") as {
    title: string;
    description: string;
  }[];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* 우측에 사진, 좌측으로 갈수록 배경색으로 흐려져서 텍스트가 읽히도록 합니다. 모바일은 사진 전체에 어두운 막을 덮습니다. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[68%]">
          <Image
            src="/hero/the-grand-ho-tram.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/80 to-bg lg:hidden" />
          <div className="absolute inset-y-0 -left-0.5 right-0 hidden bg-gradient-to-r from-bg via-bg/55 to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(205,160,94,0.14),transparent_55%)]" />
        <Container className="relative flex flex-col items-start gap-6 py-24 sm:py-32 lg:py-40">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              {t("hero.eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.15] text-fg sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <LinkButton href="/reserve" size="lg">
                {t("hero.ctaPrimary")}
              </LinkButton>
              <Link
                href="/events"
                className={buttonClassName("secondary", "lg")}
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Highlights */}
      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              {t("highlights.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-md text-2xl font-semibold text-fg sm:text-3xl">
              {t("highlights.title")}
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, i) => (
              <RevealItem key={item.title}>
                <div className="h-full rounded-2xl border border-border bg-bg-elevated p-6 transition-colors duration-300 hover:border-border-strong">
                  <HighlightIcon index={i} />
                  <h3 className="mt-4 text-base font-semibold text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {item.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Featured events */}
      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
                {t("events.eyebrow")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-fg sm:text-3xl">
                {t("events.title")}
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {t("events.viewAll")} →
            </Link>
          </Reveal>

          {events.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-border bg-bg-elevated p-8 text-sm text-fg-muted">
              {t("events.empty")}
            </p>
          ) : (
            <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <RevealItem key={event.id}>
                  <EventCard
                    event={{
                      id: event.id,
                      title: event.title,
                      description: event.description,
                      startDate: event.startDate,
                      endDate: event.endDate,
                      images: event.images,
                    }}
                    locale={locale}
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <Reveal className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-bg-elevated px-6 py-16 text-center sm:px-16">
            <h2 className="max-w-xl text-2xl font-semibold text-fg sm:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="max-w-md text-sm text-fg-muted sm:text-base">
              {t("cta.subtitle")}
            </p>
            <LinkButton href="/reserve" size="lg" className="mt-2">
              {t("cta.button")}
            </LinkButton>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
