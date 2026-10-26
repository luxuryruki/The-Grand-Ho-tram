import { redirect } from "@/i18n/navigation";

/** 예약 요청은 통합 문의하기 폼으로 안내합니다. 기존 링크의 쿼리(source, 날짜 등)는 그대로 넘깁니다. */
export default async function ReserveRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const raw = await searchParams;
  const query = Object.fromEntries(
    Object.entries(raw).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : []))
  );
  redirect({ href: { pathname: "/inquiry", query }, locale });
}
