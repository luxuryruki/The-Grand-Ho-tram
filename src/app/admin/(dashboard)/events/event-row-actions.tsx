"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export function EventRowActions({
  eventId,
  isPublished,
}: {
  eventId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePublish() {
    setLoading(true);
    try {
      await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("이 이벤트를 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        disabled={loading}
        onClick={togglePublish}
        title={isPublished ? "비공개로 전환" : "공개로 전환"}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg disabled:opacity-50"
      >
        {isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={handleDelete}
        title="삭제"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
