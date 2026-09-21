"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Trash2, UploadCloud } from "lucide-react";

type EventImage = { id: string; url: string };

type EventData = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  images: EventImage[];
};

export function EventEditForm({ event }: { event: EventData }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate);
  const [isPublished, setIsPublished] = useState(event.isPublished);
  const [images, setImages] = useState(event.images);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, startDate, endDate, isPublished }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/admin/events/${event.id}/images`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "이미지 업로드에 실패했습니다.");
        return;
      }
      setImages((prev) => [...prev, data.image]);
    } catch {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteImage(imageId: string) {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    await fetch(`/api/admin/events/${event.id}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    }).catch(() => {});
  }

  async function handleDeleteEvent() {
    if (!confirm("이 이벤트를 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    await fetch(`/api/admin/events/${event.id}`, { method: "DELETE" });
    router.push("/admin/events");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft size={15} />
          이벤트 목록
        </Link>
        <button
          type="button"
          onClick={handleDeleteEvent}
          className="flex items-center gap-1.5 text-sm text-danger hover:underline"
        >
          <Trash2 size={14} />
          이벤트 삭제
        </button>
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-fg">{event.title}</h1>

      <section className="mt-6 rounded-2xl border border-border bg-bg-elevated p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
          이미지
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-bg-elevated-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong text-fg-subtle transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {uploading ? <UploadCloud size={20} className="animate-pulse" /> : <ImagePlus size={20} />}
            <span className="text-xs">{uploading ? "업로드 중..." : "이미지 추가"}</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </section>

      <form
        onSubmit={handleSave}
        className="mt-6 space-y-5 rounded-2xl border border-border bg-bg-elevated p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted">제목</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted">설명</label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-fg-muted">시작일</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-fg-muted">종료일</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-fg">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong accent-accent"
          />
          공개 상태
        </label>

        {error && (
          <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="h-11 w-full rounded-full bg-accent text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "저장 중..." : saved ? "저장됨" : "변경사항 저장"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-fg focus:border-border-strong focus:outline-none";
