"use client";

import { useEffect } from "react";

/** 루트 <html lang>은 정적이므로, 로케일 세그먼트 진입 시 클라이언트에서 동기화합니다. */
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
