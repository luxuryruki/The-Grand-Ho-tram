import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage 공개 버킷에서 이미지를 바로 next/image로 최적화해서 보여주기 위한 설정입니다.
    // SUPABASE_URL이 예: https://xxxxxxxx.supabase.co 형태이므로 해당 호스트를 허용합니다.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // 시드 데이터(prisma/seed.ts)의 플레이스홀더 이미지용입니다. 실제 운영 이미지는
      // Supabase Storage로 교체되므로, 필요 없어지면 이 항목은 제거해도 됩니다.
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
