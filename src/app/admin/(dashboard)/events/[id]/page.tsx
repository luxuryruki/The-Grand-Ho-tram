import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toKstDateInput } from "@/lib/events";
import { EventEditForm } from "./event-edit-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!event) {
    notFound();
  }

  return (
    <EventEditForm
      event={{
        id: event.id,
        title: event.title,
        description: event.description,
        kind: event.kind,
        startDate: event.startDate.toISOString().slice(0, 10),
        endDate: event.endDate.toISOString().slice(0, 10),
        isPublished: event.isPublished,
        publishFrom: toKstDateInput(event.publishFrom),
        publishUntil: toKstDateInput(event.publishUntil),
        images: event.images.map((img: { id: string; url: string }) => ({
          id: img.id,
          url: img.url,
        })),
      }}
    />
  );
}
