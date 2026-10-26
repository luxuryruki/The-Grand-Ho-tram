import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { EventCard } from "@/components/events/event-card";
import { EventSlider } from "@/components/events/event-slider";
import { prisma } from "@/lib/prisma";
import { publicEventWhere, sortEventsByProximity } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("events");
  return { title: t("pageTitle") };
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
