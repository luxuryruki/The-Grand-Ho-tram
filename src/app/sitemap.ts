import type { MetadataRoute } from "next";
import { HOTELS } from "@/data/hotels";
import { prisma } from "@/lib/prisma";
import { publicEventWhere } from "@/lib/events";
import { getSiteUrl } from "@/lib/site-url";

// 이벤트가 수시로 바뀌므로 요청 시점에 만듭니다.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().origin;
  const now = new Date();

  // 카지노 시설 안내 페이지는 일부러 사이트맵에 넣지 않습니다(검색 노출 대상에서 제외).
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hotels`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...HOTELS.flatMap((hotel) => [
      { url: `${base}/hotels/${hotel.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
      ...hotel.rooms.map((room) => ({
        url: `${base}/hotels/${hotel.id}/rooms/${room.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]),
    { url: `${base}/golf`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/events`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/inquiry`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    const events = await prisma.event.findMany({
      where: publicEventWhere(now),
      select: { id: true, updatedAt: true },
    });
    return [
      ...pages,
      ...events.map((e) => ({
        url: `${base}/events/${e.id}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // DB에 접속하지 못해도 사이트맵은 기본 페이지로 응답합니다.
    return pages;
  }
}
