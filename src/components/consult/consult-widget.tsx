"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useConsult } from "./consult-provider";
import { cn } from "@/lib/utils";
import { getOrCreateSessionId } from "@/lib/client-session";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * 방문자용 AI 상담 위젯 (플로팅 버튼 + 패널).
 * /api/consult 로 스트리밍 응답을 받아 실시간으로 이어붙입니다.
 */
export function ConsultWidget() {
  const { isOpen, close, toggle } = useConsult();
  const t = useTranslations("consult");
  const locale = useLocale();
  // sessionStorage는 클라이언트에만 있으므로 lazy initializer에서 안전하게 읽습니다
  // (렌더링 결과에 영향을 주지 않는 내부 식별자라 SSR과의 hydration 불일치 문제가 없습니다).
  const [sessionId] = useState(() =>
    typeof window === "undefined" ? "" : getOrCreateSessionId()
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isStreaming || !sessionId) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, locale }),
      });

      if (!res.ok || !res.body) {
        throw new Error("stream failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: assistantText };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: t("error") };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={t("openWidget")}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_12px_32px_-8px_rgba(205,160,94,0.55)] sm:bottom-8 sm:right-8"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-2xl sm:bottom-28 sm:right-8"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-fg">{t("title")}</p>
                <p className="text-xs text-fg-muted">{t("subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <p className="rounded-xl bg-bg-elevated-2 px-3 py-2.5 text-sm text-fg-muted">
                  {t("greeting")}
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-accent text-accent-fg"
                      : "bg-bg-elevated-2 text-fg"
                  )}
                >
                  {m.content ||
                    (isStreaming && i === messages.length - 1 ? "···" : "")}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="h-10 flex-1 rounded-full border border-border bg-bg px-4 text-sm text-fg placeholder:text-fg-subtle focus:border-border-strong focus:outline-none"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label={t("send")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="border-t border-border px-4 py-2 text-[11px] leading-snug text-fg-subtle">
              {t("disclaimer")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
