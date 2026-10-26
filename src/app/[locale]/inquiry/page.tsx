import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { buttonClassName } from "@/components/ui/button";
import { getHotel, getRoom } from "@/data/hotels";
import { formatDateLabel, nightsBetween } from "@/lib/calendar";
import { KAKAO_CHAT_URL } from "@/lib/contact";
import { parseIsoDate } from "@/lib/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "inquiry" });
  return { title: t("pageTitle") };
}

type SearchParams = { source?: string; checkIn?: string; checkOut?: string };

/** 호텔·객실 상세에서 넘어온 경우 "어떤 호텔/객실/날짜를 문의하는지" 한 줄로 만들어 안내합니다. */
function buildContext(
  locale: string,
  nightsLabel: (n: number) => string,
  { source, checkIn, checkOut }: SearchParams
): string | null {
  const room = /^room:([^/]+)\/(.+)$/.exec(source ?? "");
  const hotelMatch = /^hotel:(.+)$/.exec(source ?? "");
  const hotel = getHotel(room?.[1] ?? hotelMatch?.[1] ?? "");
  if (!hotel) return null;

  const parts: string[] = [hotel.name];
  const roomData = room ? getRoom(hotel, room[2]) : undefined;
  if (roomData) parts.push(roomData.name);

  if (checkIn && checkOut && parseIsoDate(checkIn) !== null && parseIsoDate(checkOut) !== null) {
    const nights = nightsBetween(checkIn, checkOut);
    if (nights > 0) {
      parts.push(
        `${formatDateLabel(checkIn, locale)} ~ ${formatDateLabel(checkOut, locale)} (${nightsLabel(nights)})`
      );
    }
  }
  return parts.join(" · ");
}

export default async function InquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "inquiry" });
  const items = t.raw("guideItems") as string[];
  const steps = t.raw("steps") as string[];
  const context = buildContext(locale, (n) => t("nights", { count: n }), query);

  return (
    <Container className="py-16 sm:py-24">
      <Reveal>
        <h1 className="text-3xl font-semibold text-fg sm:text-4xl">{t("pageTitle")}</h1>
        <p className="mt-3 max-w-xl break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
          {t("pageSubtitle")}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <Reveal delay={0.05}>
          <div className="rounded-2xl border border-border bg-bg-elevated p-6 text-center sm:p-8">
            <div className="mx-auto w-full max-w-[18rem] overflow-hidden rounded-xl bg-white p-2">
              <Image
                src="/kakao/chat-qr.png"
                alt={t("qrAlt")}
                width={800}
                height={800}
                sizes="288px"
                priority
                className="h-auto w-full"
              />
            </div>
            <p className="mt-5 break-keep text-sm font-medium text-fg">{t("qrCaption")}</p>
            <p className="mt-1.5 break-keep text-xs leading-relaxed text-fg-subtle">{t("mobileHint")}</p>
            <a
              href={KAKAO_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName("primary", "lg", "mt-5 w-full")}
            >
              <MessageCircle size={18} />
              {t("openButton")}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6">
          {context && (
            <div className="rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
              <p className="text-xs text-fg-subtle">{t("contextLabel")}</p>
              <p className="mt-1 break-keep text-sm font-medium text-fg">{context}</p>
              <p className="mt-2 break-keep text-xs leading-relaxed text-fg-muted">{t("contextHint")}</p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8">
            <p className="break-keep text-base font-medium leading-relaxed text-fg">{t("lead")}</p>

            <h2 className="mt-6 border-t border-border pt-5 text-sm font-semibold text-fg">{t("stepsTitle")}</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-fg-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span className="break-keep">{step}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-6 border-t border-border pt-5 text-sm font-semibold text-fg">{t("guideTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-fg-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span className="break-keep">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
