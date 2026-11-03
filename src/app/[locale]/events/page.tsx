import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { EventCard } from "@/components/events/event-card";
import { EventSlider } from "@/components/events/event-slider";
import { prisma } from "@/lib/prisma";
import { publicEventWhere, sortEventsByProximity } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "호짬 호텔·골프 이벤트 · 프로모션",
    description: "호짬 리조트 호텔과 골프 관련 이벤트·프로모션 소식을 한곳에 모아 안내합니다. 진행 중인 이벤트와 곧 시작하는 이벤트를 확인하세요.",
    alternates: { canonical: "/events" },
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("events");

  const events = sortEventsByProximity(
    await prisma.event.findMany({
      where: publicEventWhere(),
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    })
  );

  return (
    <Container className="py-16 sm:py-24">
      <Reveal>
        <h1 className="text-3xl font-semibold text-fg sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 max-w-lg text-sm text-fg-muted sm:text-base">
          {t("pageSubtitle")}
        </p>
      </Reveal>

      {events.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-border bg-bg-elevated p-8 text-sm text-fg-muted">
          {t("empty")}
        </p>
      ) : (
        <Reveal delay={0.05} className="mt-12">
          <EventSlider>
            {events.map((event) => (
              <EventCard
                key={event.id}
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
            ))}
          </EventSlider>
        </Reveal>
      )}
    </Container>
  );
}
