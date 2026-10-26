import { Reveal } from "@/components/motion/reveal";
import { MemberNotice } from "@/components/membership/member-notice";
import { PriceDisclaimer } from "@/components/pricing/price-disclaimer";
import { Container } from "@/components/site/container";
import { GOLF_RATES, golfText } from "@/data/golf";
import { GOLF_HOLES } from "@/lib/golf-pricing";
import type { GolfSheet } from "@/lib/golf-schema";
import { formatVnd } from "@/lib/pricing";
import { GolfRateCalculator } from "./golf-rate-calculator";

const ROWS = ["weekday", "weekend", "holiday"] as const;

/** 골프 페이지의 회원 전용 요금 섹션 (요금은 DB 값) */
export function GolfRates({
  sheet,
  locale,
}: {
  sheet: GolfSheet;
  locale: string;
}) {
  const t = (v: Parameters<typeof golfText>[0]) => golfText(v, locale);

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
            {t(GOLF_RATES.title)}
          </h2>
          <p className="mt-4 max-w-2xl break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
            {t(GOLF_RATES.subtitle)}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch">
          <Reveal delay={0.05} className="h-full">
            <div className="h-full overflow-x-auto rounded-2xl border border-border bg-bg-elevated">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-fg-subtle">
                  <tr>
                    <th className="px-5 py-3.5">{t(GOLF_RATES.tableHead)}</th>
                    {GOLF_HOLES.map((h) => (
                      <th key={h} className="px-5 py-3.5 text-right">
                        {h}
                        {t(GOLF_RATES.holesLabel)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr
                      key={row}
                      className="border-b border-border last:border-b-0"
                    >
                      <th scope="row" className="px-5 py-4 font-medium text-fg">
                        {t(GOLF_RATES.rows[row])}
                      </th>
                      {GOLF_HOLES.map((h) => (
                        <td
                          key={h}
                          className="px-5 py-4 text-right tabular-nums text-fg-muted"
                        >
                          {formatVnd(sheet.greenFees[row][h])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6">
              <h3 className="text-base font-semibold text-fg">
                {t(GOLF_RATES.extrasTitle)}
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="break-keep text-fg-muted">
                    {t(GOLF_RATES.twilight)}
                  </dt>
                  <dd className="shrink-0 tabular-nums text-fg">
                    {formatVnd(sheet.extras.twilightDry)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-fg-muted">{t(GOLF_RATES.caddie)}</dt>
                  <dd className="shrink-0 tabular-nums text-fg">
                    {formatVnd(sheet.extras.caddieBooking)}
                  </dd>
                </div>
              </dl>
              <ul className="mt-5 space-y-1 border-t border-border pt-4 text-xs leading-relaxed text-fg-subtle">
                {GOLF_RATES.notes.map((n) => (
                  <li key={n.en} className="break-keep">
                    {t(n)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-6">
            <GolfRateCalculator sheet={sheet} />
          </div>
        </Reveal>

        <div className="mt-6 space-y-4">
          <PriceDisclaimer />
          <MemberNotice />
        </div>
      </Container>
    </section>
  );
}

/** 요금 표시를 끈 동안 골프 페이지의 회원가 영역: 금액 없이 소개와 문의 안내만 보여 줍니다. */
export function GolfMemberIntro({ locale }: { locale: string }) {
  const t = (v: Parameters<typeof golfText>[0]) => golfText(v, locale);
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-semibold text-fg sm:text-4xl">{t(GOLF_RATES.title)}</h2>
          <p className="mt-4 max-w-2xl break-keep text-sm leading-relaxed text-fg-muted sm:text-base">
            {t(GOLF_RATES.introSubtitle)}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <MemberNotice className="mt-8 max-w-3xl" />
        </Reveal>
      </Container>
    </section>
  );
}
