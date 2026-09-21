import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { ReserveForm } from "./reserve-form";

export async function generateMetadata() {
  const t = await getTranslations("reserve");
  return { title: t("pageTitle") };
}

export default async function ReservePage() {
  const t = await getTranslations("reserve");

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

      <div className="mt-12 max-w-2xl">
        <Suspense fallback={null}>
          <ReserveForm />
        </Suspense>
      </div>
    </Container>
  );
}
