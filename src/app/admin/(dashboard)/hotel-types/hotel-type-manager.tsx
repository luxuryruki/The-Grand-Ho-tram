"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";

type HotelType = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export function HotelTypeManager({ initial }: { initial: HotelType[] }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/hotel-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "추가에 실패했습니다.");
        return;
      }
      setItems((prev) => [...prev, data.hotelType]);
      setName("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(item: HotelType) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i))
    );
    await fetch(`/api/admin/hotel-types/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    }).catch(() => {});
  }

  async function remove(item: HotelType) {
    if (!confirm(`"${item.name}" 항목을 삭제하시겠습니까?`)) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await fetch(`/api/admin/hotel-types/${item.id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="divide-y divide-border rounded-2xl border border-border bg-bg-elevated">
        {items.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-fg-muted">
            등록된 호텔 타입이 없습니다.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-fg">{item.name}</p>
              {item.description && (
                <p className="mt-0.5 text-xs text-fg-muted">{item.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleActive(item)}
                title={item.isActive ? "비활성화" : "활성화"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-elevated-2 hover:text-fg"
              >
                {item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                title="삭제"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-2xl border border-dashed border-border-strong p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1.5 block text-sm text-fg-muted">이름</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 프레지덴셜 스위트"
            className="h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-fg focus:border-border-strong focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm text-fg-muted">설명 (선택)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-fg focus:border-border-strong focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={15} />
          추가
        </button>
      </form>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
