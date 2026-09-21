import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// next/font/google 대신 geist 패키지(자체 호스팅 폰트 파일 내장)를 사용합니다.
// 빌드 시 Google Fonts로 외부 네트워크 요청을 하지 않아, 아웃바운드 네트워크가
// 제한된 환경(사내망, 일부 CI 등)에서도 빌드가 안정적으로 동작합니다.

export const metadata: Metadata = {
  title: {
    default: "THE GRAND",
    template: "%s · THE GRAND",
  },
  description:
    "THE GRAND — premium travel, hotel & vehicle reservation experience.",
};

// 이 파일은 앱 전체(공개 페이지 + /admin)의 최상위 <html>/<body>를 정의합니다.
// 로케일별 문구/방향은 src/app/[locale]/layout.tsx 에서 처리합니다.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-bg text-fg">{children}</body>
    </html>
  );
}
