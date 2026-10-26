"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { todayKst } from "@/lib/events";
import { EMPTY_EVENT_VALUES, EventFields, toEventPayload, type EventFormValues } from "../event-fields";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 서버 제한(8MB)과 같게

type Picked = { key: string; file: File; preview: string };

export default function NewEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<EventFormValues>(() => ({ ...EMPTY_EVENT_VALUES, publishFrom: todayKst() }));
  const [picked, setPicked] = useState<Picked[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // 이벤트는 만들어졌는데 이미지 업로드만 실패한 경우, 다시 시도할 때 이벤트를 또 만들지 않도록 기억합니다.
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<ReadonlySet<string>>(new Set());
  const previewsRef = useRef<string[]>([]);

  useEffect(() => {
    const urls = previewsRef;
    return () => urls.current.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: Picked[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(list)) {
      if (!ALLOWED_TYPES.includes(file.type)) rejected.push(`${file.name} (jpg, png, webp, gif만 가능)`);
      else if (file.size > MAX_FILE_SIZE) rejected.push(`${file.name} (8MB 초과)`);
      else {
        const preview = URL.createObjectURL(file);
        previewsRef.current.push(preview);
        next.push({ key: `${file.name}-${file.size}-${crypto.randomUUID()}`, file, preview });
      }
    }
    setPicked((prev) => [...prev, ...next]);
    setError(rejected.length ? `올릴 수 없는 파일이 있습니다: ${rejected.join(", ")}` : null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(key: string) {
    setPicked((prev) => prev.filter((p) => p.key !== key));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!values.startDate || (values.kind === "PERIOD" && !values.endDate)) {
      setError(values.kind === "PERIOD" ? "시작일과 종료일을 입력해 주세요." : "이벤트 날짜를 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      let id = createdId;
      if (!id) {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toEventPayload(values)),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "등록에 실패했습니다.");
          return;
        }
        id = data.event.id as string;
        setCreatedId(id);
      }

      // 선택한 순서대로 올립니다(첫 번째 이미지가 대표 이미지).
      const failed: string[] = [];
      const done = new Set(uploaded);
      for (const p of picked) {
        if (done.has(p.key)) continue;
        const body = new FormData();
        body.append("file", p.file);
        const up = await fetch(`/api/admin/events/${id}/images`, { method: "POST", body }).catch(() => null);
        if (up?.ok) {
          done.add(p.key);
          setUploaded(new Set(done));
        } else failed.push(p.file.name);
      }
      if (failed.length > 0) {
        setError(
          `이벤트는 등록되었지만 이미지 ${failed.length}장을 올리지 못했습니다(${failed.join(", ")}). 다시 등록 버튼을 누르면 실패한 이미지만 다시 올립니다.`
        );
        return;
      }
      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const remaining = picked.filter((p) => !uploaded.has(p.key)).length;

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft size={15} />
        이벤트 목록
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-fg">새 이벤트</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-border bg-bg-elevated p-6"
      >
        <fieldset disabled={submitting || createdId !== null} className="min-w-0 space-y-5">
          <EventFields values={values} onChange={setValues} publishLabel="등록 후 바로 공개하기" isNew />
        </fieldset>

        <section>
          <h2 className="text-sm text-fg-muted">이미지 (선택, 첫 번째 이미지가 대표 이미지)</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {picked.map((p, i) => (
              <div key={p.key} className="group relative aspect-square overflow-hidden rounded-xl bg-bg-elevated-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-fg">
                    대표
                  </span>
                )}
                {!uploaded.has(p.key) && !submitting && (
                  <button
                    type="button"
                    onClick={() => removeFile(p.key)}
                    aria-label="이미지 빼기"
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong text-fg-subtle transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <ImagePlus size={20} />
              <span className="text-xs">이미지 추가</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </section>

        {error && (
          <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-full bg-accent text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? picked.length > 0
              ? "등록하고 이미지 올리는 중..."
              : "등록 중..."
            : createdId
              ? `이미지 ${remaining}장 다시 올리기`
              : "이벤트 등록"}
        </button>
      </form>
    </div>
  );
}
