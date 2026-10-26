import Image from "next/image";
import { ImageOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { publicEventWhere } from "@/lib/events";
import { formatEventDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("events");

  const event = await prisma.event.findFirst({
    where: { id, ...publicEventWhere() },
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

      {/* 왼쪽에 포스터(원본 비율 그대로, 잘림 없이), 오른쪽에 이벤트 설명. 좁은 화면에서는 위아래로 쌓입니다. */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:items-start lg:gap-14">
        {event.images.length === 0 ? (
          <Reveal delay={0.05}>
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl bg-bg-elevated-2 text-fg-subtle">
              <ImageOff size={36} />
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.05} className="space-y-4">
            {event.images.map((img: { id: string; url: string }, i: number) => (
              <div key={img.id} className="overflow-hidden rounded-2xl bg-bg-elevated-2">
                <Image
                  src={img.url}
                  alt={event.title}
                  width={0}
                  height={0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={i === 0}
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </Reveal>
        )}

        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-wide text-accent">
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium">
              {event.kind === "SINGLE_DAY" ? t("kindSingle") : t("kindPeriod")}
            </span>
            <span>{formatEventDate(event.kind, event.startDate, event.endDate, locale)}</span>
          </p>
          <h1 className="mt-4 break-keep text-3xl font-semibold leading-tight text-fg sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-6 whitespace-pre-wrap break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
            {event.description}
          </p>
          <LinkButton
            href={`/inquiry?source=${encodeURIComponent(`event:${event.id}`)}`}
            size="lg"
            className="mt-8 w-full sm:w-auto"
          >
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>
    </Container>
  );
}
