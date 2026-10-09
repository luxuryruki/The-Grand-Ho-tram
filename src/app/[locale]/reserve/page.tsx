import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { buildHotelOptions } from "@/data/hotels/hotel-options";
import { getRateBook } from "@/lib/rates";
import { ReserveForm } from "./reserve-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reserve" });
  return { title: t("pageTitle") };
}

export default async function ReservePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "reserve" });
  const book = await getRateBook();
  const hotels = buildHotelOptions(locale, book);

  return (
    <Container className="py-16 sm:py-24">
      <Reveal>
        <h1 className="text-3xl font-semibold text-fg sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 max-w-lg break-keep text-sm text-fg-muted sm:text-base">
          {t("pageSubtitle")}
        </p>
      </Reveal>

      <div className="mt-12 max-w-2xl">
        <Suspense fallback={null}>
          <ReserveForm hotels={hotels} holidays={book.holidays} />
        </Suspense>
      </div>
    </Container>
  );
}
