"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOrCreateSessionId } from "@/lib/client-session";
import {
  buildKakaoChatUrl,
  buildReservationSummaryText,
  buildWhatsappUrl,
  buildZaloUrl,
} from "@/lib/deeplink";

type HotelType = { id: string; name: string; description: string | null };

type FormState = {
  hotelType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  needsVehicle: boolean;
  vehicleType: string;
  pickupLocation: string;
  contactName: string;
  contactPhone: string;
  preferredChannel: "TELEGRAM" | "KAKAO";
};

const INITIAL_STATE: FormState = {
  hotelType: "",
  checkIn: "",
  checkOut: "",
  guestCount: 2,
  needsVehicle: false,
  vehicleType: "",
  pickupLocation: "",
  contactName: "",
  contactPhone: "",
  preferredChannel: "TELEGRAM",
};

export function ReserveForm() {
  const t = useTranslations("reserve");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "reserve";

  const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  useEffect(() => {
    fetch("/api/hotel-types")
      .then((res) => res.json())
      .then((data: { hotelTypes: HotelType[] }) => {
        setHotelTypes(data.hotelTypes ?? []);
        setForm((f) =>
          f.hotelType ? f : { ...f, hotelType: data.hotelTypes?.[0]?.name ?? "" }
        );
      })
      .catch(() => setHotelTypes([]));
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (new Date(form.checkOut).getTime() <= new Date(form.checkIn).getTime()) {
      setError(t("validation.dates"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guestCount: Number(form.guestCount),
          source,
          sessionId: getOrCreateSessionId(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? t("errorBody"));
        return;
      }

      setSubmitted(form);
    } catch {
      setError(t("errorBody"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SuccessView data={submitted} locale={locale} onReset={() => setSubmitted(null)} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8"
    >
      <FormSection title={t("sectionStay")}>
        <Field label={t("hotelType")} htmlFor="hotelType">
          <select
            id="hotelType"
            required
            value={form.hotelType}
            onChange={(e) => update("hotelType", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {t("hotelTypePlaceholder")}
            </option>
            {hotelTypes.map((ht) => (
              <option key={ht.id} value={ht.name}>
                {ht.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("checkIn")} htmlFor="checkIn">
            <input
              id="checkIn"
              type="date"
              required
              value={form.checkIn}
              onChange={(e) => update("checkIn", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label={t("checkOut")} htmlFor="checkOut">
            <input
              id="checkOut"
              type="date"
              required
              value={form.checkOut}
              onChange={(e) => update("checkOut", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label={`${t("guestCount")} (${t("guestCountUnit")})`} htmlFor="guestCount">
          <input
            id="guestCount"
            type="number"
            min={1}
            max={50}
            required
            value={form.guestCount}
            onChange={(e) => update("guestCount", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </FormSection>

      <FormSection title={t("sectionVehicle")}>
        <label className="flex items-center gap-2.5 text-sm text-fg">
          <input
            type="checkbox"
            checked={form.needsVehicle}
            onChange={(e) => update("needsVehicle", e.target.checked)}
            className="h-4 w-4 rounded border-border-strong accent-accent"
          />
          {t("needsVehicle")}
        </label>

        {form.needsVehicle && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("vehicleType")} htmlFor="vehicleType">
              <input
                id="vehicleType"
                value={form.vehicleType}
                onChange={(e) => update("vehicleType", e.target.value)}
                placeholder={t("vehicleTypePlaceholder")}
                className={inputClass}
              />
            </Field>
            <Field label={t("pickupLocation")} htmlFor="pickupLocation">
              <input
                id="pickupLocation"
                value={form.pickupLocation}
                onChange={(e) => update("pickupLocation", e.target.value)}
                placeholder={t("pickupLocationPlaceholder")}
                className={inputClass}
              />
            </Field>
          </div>
        )}
      </FormSection>

      <FormSection title={t("sectionContact")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("contactName")} htmlFor="contactName">
            <input
              id="contactName"
              required
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label={t("contactPhone")} htmlFor="contactPhone">
            <input
              id="contactPhone"
              type="tel"
              required
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label={t("preferredChannel")}>
          <div className="flex gap-2">
            {(["TELEGRAM", "KAKAO"] as const).map((channel) => (
              <button
                key={channel}
                type="button"
                onClick={() => update("preferredChannel", channel)}
                className={cn(
                  "h-10 flex-1 rounded-lg border text-sm transition-colors",
                  form.preferredChannel === channel
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-fg-muted hover:border-border-strong"
                )}
              >
                {channel === "TELEGRAM" ? t("channelTelegram") : t("channelKakao")}
              </button>
            ))}
          </div>
        </Field>
      </FormSection>

      {error && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Button type="submit" size="lg" disabled={submitting} className="w-full">
          {submitting ? t("submitting") : t("submit")}
        </Button>
        <p className="text-center text-xs text-fg-subtle">{t("requiredNotice")}</p>
      </div>
    </form>
  );
}

function SuccessView({
  data,
  locale,
  onReset,
}: {
  data: FormState;
  locale: string;
  onReset: () => void;
}) {
  const t = useTranslations("reserve");
  const [copied, setCopied] = useState(false);

  const summary = buildReservationSummaryText(
    {
      hotelType: data.hotelType,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guestCount: data.guestCount,
      needsVehicle: data.needsVehicle,
      vehicleType: data.vehicleType,
      pickupLocation: data.pickupLocation,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
    },
    locale
  );

  const kakaoUrl = buildKakaoChatUrl();
  const whatsappUrl = buildWhatsappUrl(summary);
  const zaloUrl = buildZaloUrl();

  async function handleCopyAndOpen(url: string) {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근이 막혀도 채팅방은 열어줍니다.
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-bg-elevated p-6 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-fg">
        <Check size={26} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-fg">{t("successTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {t("successBody")}
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
        {kakaoUrl && (
          <Button variant="secondary" onClick={() => handleCopyAndOpen(kakaoUrl)}>
            {t("chatKakao")}
          </Button>
        )}
        {whatsappUrl && (
          <LinkButton href={whatsappUrl} target="_blank" variant="secondary">
            {t("chatWhatsapp")}
          </LinkButton>
        )}
        {zaloUrl && (
          <Button variant="secondary" onClick={() => handleCopyAndOpen(zaloUrl)}>
            {t("chatZalo")}
          </Button>
        )}
      </div>

      {(kakaoUrl || zaloUrl) && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-fg-subtle">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "복사됨 — 채팅창에 붙여넣기 해주세요" : "채팅방이 열리면 요약 내용을 붙여넣기 해주세요"}
        </p>
      )}

      <button
        type="button"
        onClick={onReset}
        className="text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
      >
        {t("newRequest")}
      </button>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-fg-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-fg focus:border-border-strong focus:outline-none";
