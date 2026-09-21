"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "로그인에 실패했습니다.");
        return;
      }
      const from = searchParams.get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-border bg-bg-elevated p-8"
    >
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Lock size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-fg">관리자 로그인</h1>
          <p className="mt-1 text-sm text-fg-muted">
            THE GRAND 내부 관리자 페이지입니다.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="id" className="mb-1.5 block text-sm text-fg-muted">
            아이디
          </label>
          <input
            id="id"
            name="id"
            autoComplete="username"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-fg focus:border-border-strong focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm text-fg-muted"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-fg focus:border-border-strong focus:outline-none"
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full bg-accent text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </form>
  );
}
