/** 검색엔진용 구조화 데이터(JSON-LD). 화면에는 보이지 않고, 검색 결과에 정보를 더 보기 좋게 보여 주는 데 쓰입니다. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // </script> 로 끊기는 것을 막기 위해 "<"를 이스케이프합니다.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
