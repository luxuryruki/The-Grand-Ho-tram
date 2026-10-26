import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: "%s · THE CONCIERGE HO TRAM 관리자",
  },
  robots: { index: false, follow: false },
};

// 관리자 영역은 내부 전용이라 next-intl 다국어 처리를 하지 않고 한국어로 고정합니다.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg text-fg">{children}</div>;
}
