import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { MessageCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { KAKAO_CHAT_URL } from "@/lib/contact";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { EventCard } from "@/components/events/event-card";
import { ResortGuide } from "@/components/home/resort-guide";
import { MemberBanner } from "@/components/membership/member-banner";
import { prisma } from "@/lib/prisma";
import { publicEventWhere, sortEventsByProximity } from "@/lib/events";
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

  // 오늘과 가까운 날짜의 이벤트가 먼저 오도록 정렬한 뒤 앞의 3개만 보여 줍니다.
  const events = sortEventsByProximity(
    await prisma.event.findMany({
      where: publicEventWhere(),
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    })
  ).slice(0, 3);

  // 둘째 줄은 쉼표 뒤 부분만 포인트 색으로 강조합니다. 쉼표가 없으면 그대로 표시합니다.
  const [line2Lead, line2Accent] = t("hero.titleLine2").split(", ");

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
            <h1 className="max-w-2xl break-keep text-[2rem] font-semibold leading-[1.2] text-fg sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              {line2Lead}
              {line2Accent && (
                <>
                  {", "}
                  <span className="text-accent">{line2Accent}</span>
                </>
              )}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a href="#kakao-contact" className={buttonClassName("primary", "lg")}>
                {t("hero.ctaPrimary")}
              </a>
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

      <ResortGuide />

      <MemberBanner />

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
                      kind: event.kind,
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

      {/* 카카오톡 문의: QR을 바로 보여 줍니다 */}
      <section id="kakao-contact" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
        <Container>
          <Reveal className="grid items-center gap-10 rounded-3xl border border-border bg-bg-elevated px-6 py-12 sm:px-12 sm:py-14 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
            <div className="text-center md:text-left">
              <h2 className="break-keep text-2xl font-semibold text-fg sm:text-3xl">{t("cta.title")}</h2>
              <p className="mt-4 max-w-md break-keep text-sm leading-relaxed text-fg-muted sm:text-base md:mx-0 mx-auto">
                {t("cta.subtitle")}
              </p>
              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName("primary", "lg", "mt-7 w-full sm:w-auto md:hidden")}
              >
                <MessageCircle size={18} />
                {t("cta.button")}
              </a>
            </div>
            <div className="mx-auto text-center">
              <div className="w-56 overflow-hidden rounded-2xl bg-white p-2 sm:w-64">
                <Image
                  src="/kakao/chat-qr.png"
                  alt={t("cta.qrAlt")}
                  width={800}
                  height={800}
                  sizes="256px"
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-sm font-medium text-fg">{t("cta.qrCaption")}</p>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
