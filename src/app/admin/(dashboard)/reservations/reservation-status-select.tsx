"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "NEW", label: "신규" },
  { value: "IN_PROGRESS", label: "확인중" },
  { value: "DONE", label: "완료" },
  { value: "CANCELED", label: "취소" },
] as const;

const STATUS_STYLE: Record<string, string> = {
  NEW: "text-accent",
  IN_PROGRESS: "text-warning",
  DONE: "text-success",
  CANCELED: "text-fg-subtle",
};

export function ReservationStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setLoading(true);
    try {
      await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(
        "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs font-medium focus:outline-none disabled:opacity-50",
        STATUS_STYLE[value]
      )}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
