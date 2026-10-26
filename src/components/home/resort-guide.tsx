import { ArrowRight, Building2, Car, Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HOTELS } from "@/data/hotels";

// 세 호텔의 총 객실 수(대략). 공개 자료 기준: 인터컨티넨탈 약 541실, 홀리데이 인 502실, 익소라 1단계 164실 + 빌라 46채
// (약 1,250실). 출처마다 수치가 조금씩 달라 정확한 값 대신 안전하게 "1,200+"로 표기합니다. 확정 수치를 받으면 바꾸세요.
const TOTAL_ROOMS = "1,200+";

const PILLARS = [
  { key: "hotels", href: "/hotels", Icon: Building2 },
  { key: "golf", href: "/golf", Icon: Flag },
  { key: "transfer", href: "/inquiry?source=home-guide", Icon: Car },
] as const;

/** 홈: 더 그랜드 호짬 리조트를 전문적으로 안내하는 컨시어지라는 소개 */
export function ResortGuide() {
  const t = useTranslations("home.guide");
  const stats = [
    { value: String(HOTELS.length), label: t("statHotels") },
    { value: TOTAL_ROOMS, label: t("statRooms") },
    { value: t("statHolesValue"), label: t("statHoles") },
    { value: t("statSupportValue"), label: t("statSupport") },
  ];

  return (
    <section className="border-t border-border py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <Reveal>
          <h2 className="whitespace-pre-line break-keep text-2xl font-semibold leading-snug text-fg sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-5 break-keep text-sm leading-relaxed text-fg-muted sm:text-base sm:leading-relaxed">
            {t("body")}
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-bg-elevated px-4 py-5">
                <dd className="text-xl font-semibold text-accent sm:text-2xl">{s.value}</dd>
                <dt className="mt-1 text-xs text-fg-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <RevealGroup className="space-y-4">
          {PILLARS.map(({ key, href, Icon }) => (
            <RevealItem key={key}>
              <Link
                href={href}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-bg-elevated p-5 transition-colors duration-300 hover:border-accent/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-fg">{t(`${key}Title`)}</span>
                  <span className="mt-1.5 block break-keep text-sm leading-relaxed text-fg-muted">
                    {t(`${key}Body`)}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
