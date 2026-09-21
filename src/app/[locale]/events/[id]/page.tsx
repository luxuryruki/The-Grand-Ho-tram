import Image from "next/image";
import { ImageOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("events");

  const event = await prisma.event.findFirst({
    where: { id, isPublished: true },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!event) {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-fg">
          {t("notFoundTitle")}
        </h1>
        <p className="text-sm text-fg-muted">{t("notFoundBody")}</p>
        <Link
          href="/events"
          className="mt-2 text-sm text-accent hover:underline"
        >
          {t("backToList")}
        </Link>
      </Container>
    );
  }

  const cover = event.images[0];
  const rest = event.images.slice(1);

  return (
    <Container className="py-16 sm:py-24">
      <Reveal>
        <Link
          href="/events"
          className="text-sm text-fg-muted transition-colors hover:text-fg"
        >
          ← {t("backToList")}
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-bg-elevated-2">
          {cover ? (
            <Image
              src={cover.url}
              alt={event.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-fg-subtle">
              <ImageOff size={36} />
            </div>
          )}
        </div>
      </Reveal>

      {rest.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {rest.map((img: { id: string; url: string }) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-xl bg-bg-elevated-2"
            >
              <Image
                src={img.url}
                alt={event.title}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-wide text-accent">
            {t("period")}: {formatDateRange(event.startDate, event.endDate, locale)}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-fg sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-fg-muted sm:text-base">
            {event.description}
          </p>
        </div>

        <LinkButton
          href={`/reserve?source=${encodeURIComponent(`event:${event.id}`)}`}
          size="lg"
          className="shrink-0"
        >
          {t("cta")}
        </LinkButton>
      </div>
    </Container>
  );
}
