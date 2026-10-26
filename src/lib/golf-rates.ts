import "server-only";
import { prisma } from "./prisma";
import { golfSheetSchema, type GolfSheet } from "./golf-schema";

/** DB에 올려 둔 골프 요금표. 아직 올리지 않았거나 형식이 맞지 않으면 null */
export async function getGolfSheet(): Promise<GolfSheet | null> {
  const row = await prisma.golfRateSheet.findUnique({ where: { id: "current" } });
  if (!row) return null;
  const parsed = golfSheetSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}
