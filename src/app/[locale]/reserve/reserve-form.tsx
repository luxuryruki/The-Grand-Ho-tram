"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { PriceDisclaimer } from "@/components/pricing/price-disclaimer";
import { StayQuote } from "@/components/pricing/stay-quote";
import type { HotelOption } from "@/data/hotels/hotel-options";
import { VEHICLES, getVehicle, vehicleText } from "@/data/vehicles";
import { addDays, formatVnd, parseIsoDate, quoteStay } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { getOrCreateSessionId } from "@/lib/client-session";
import {
  buildKakaoChatUrl,
  buildReservationSummaryText,
  buildWhatsappUrl,
  buildZaloUrl,
} from "@/lib/deeplink";

type FormState = {
  hotelId: string;
  /** 빈 문자열이면 객실 미정 */
  roomSlug: string;
  /** 객실에 요금 구성이 여럿일 때 선택한 구성(RoomRate.rateKey) */
  rateKey: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  needsVehicle: boolean;
  /** 차량 id (src/data/vehicles). 빈 문자열이면 미선택 */
  vehicleType: string;
  pickupLocation: string;
  /** 비워두면 체크인 날짜로 접수됩니다 */
  pickupDate: string;
  pickupTime: string;
  contactName: string;
  contactPhone: string;
  preferredChannel: "TELEGRAM" | "KAKAO";
};

const INITIAL_STATE: FormState = {
  hotelId: "",
  roomSlug: "",
  rateKey: "",
  checkIn: "",
  checkOut: "",
  guestCount: 2,
  needsVehicle: false,
  vehicleType: "",
  pickupLocation: "",
  pickupDate: "",
  pickupTime: "",
  contactName: "",
  contactPhone: "",
  preferredChannel: "TELEGRAM",
};

/** 호텔/객실 상세 페이지의 문의 버튼이 넘기는 source(`hotel:<id>`, `room:<id>/<slug>`)로 선택값을 미리 채웁니다. */
function preselectFromQuery(
  source: string,
  params: URLSearchParams,
  hotels: HotelOption[]
): Pick<FormState, "hotelId" | "roomSlug" | "rateKey" | "checkIn" | "checkOut"> {
  const room = /^room:([^/]+)\/(.+)$/.exec(source);
  const hotel = /^hotel:(.+)$/.exec(source);
  const hotelId = room?.[1] ?? hotel?.[1];
  const found = hotels.find((h) => h.id === hotelId);
  const checkIn = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const dates =
    parseIsoDate(checkIn) !== null && parseIsoDate(checkOut) !== null ? { checkIn, checkOut } : { checkIn: "", checkOut: "" };
  if (!found) return { hotelId: "", roomSlug: "", rateKey: "", ...dates };
  const foundRoom = room ? found.rooms.find((r) => r.slug === room[2]) : undefined;
  const rate = params.get("rate");
  const rateKey = foundRoom
    ? (foundRoom.variants.find((v) => v.rateKey === rate)?.rateKey ?? foundRoom.variants[0]?.rateKey ?? "")
    : "";
  return { hotelId: found.id, roomSlug: foundRoom?.slug ?? "", rateKey, ...dates };
}

export function ReserveForm({
  hotels,
  holidays,
}: {
  hotels: HotelOption[];
  holidays: string[];
}) {
  const t = useTranslations("reserve");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "reserve";

  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_STATE,
    ...preselectFromQuery(source, searchParams, hotels),
  }));

  const selectedHotel = hotels.find((h) => h.id === form.hotelId);
  const selectedRoom = selectedHotel?.rooms.find((r) => r.slug === form.roomSlug);
  const selectedVariant =
    selectedRoom?.variants.find((v) => v.rateKey === form.rateKey) ?? selectedRoom?.variants[0] ?? null;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

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
          roomSlug: form.roomSlug || null,
          pickupDate: form.needsVehicle ? form.pickupDate || form.checkIn : null,
          rateKey: selectedVariant?.rateKey ?? null,
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
    return (
      <SuccessView
        data={submitted}
        hotels={hotels}
        holidays={holidays}
        locale={locale}
        onReset={() => setSubmitted(null)}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8"
    >
      <FormSection title={t("sectionStay")}>
        <HotelRoomPicker
          hotels={hotels}
          hotelId={form.hotelId}
          roomSlug={form.roomSlug}
          rateKey={selectedVariant?.rateKey ?? ""}
          onHotelChange={(hotelId) =>
            setForm((f) => ({ ...f, hotelId, roomSlug: "", rateKey: "" }))
          }
          onRoomChange={(roomSlug) =>
            setForm((f) => {
              const room = hotels.find((h) => h.id === f.hotelId)?.rooms.find((r) => r.slug === roomSlug);
              return { ...f, roomSlug, rateKey: room?.variants[0]?.rateKey ?? "" };
            })
          }
          onRateChange={(rateKey) => update("rateKey", rateKey)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("checkIn")} htmlFor="checkIn">
            <input
              id="checkIn"
              type="date"
              required
              min={selectedHotel?.info?.validFrom}
              value={form.checkIn}
              onChange={(e) => {
                const checkIn = e.target.value;
                setForm((f) => ({
                  ...f,
                  checkIn,
                  checkOut: checkIn && (!f.checkOut || f.checkOut <= checkIn) ? (addDays(checkIn, 1) ?? "") : f.checkOut,
                }));
              }}
              className={inputClass}
            />
          </Field>
          <Field label={t("checkOut")} htmlFor="checkOut">
            <input
              id="checkOut"
              type="date"
              required
              min={form.checkIn ? (addDays(form.checkIn, 1) ?? undefined) : selectedHotel?.info?.validFrom}
              value={form.checkOut}
              onChange={(e) => update("checkOut", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <StayQuote
          variant={selectedVariant}
          hasRoom={Boolean(selectedRoom)}
          checkIn={form.checkIn}
          checkOut={form.checkOut}
          holidays={holidays}
          info={selectedHotel?.info ?? null}
        />

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
          <div className="space-y-4">
            <Field label={t("vehicleType")}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VEHICLES.map((vehicle) => (
                  <label key={vehicle.id} className="block cursor-pointer">
                    <input
                      type="radio"
                      name="vehicle"
                      value={vehicle.id}
                      required
                      checked={form.vehicleType === vehicle.id}
                      onChange={() => update("vehicleType", vehicle.id)}
                      className="peer sr-only"
                    />
                    <div className="h-full rounded-xl border border-border bg-bg p-4 transition hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                      <p className="text-sm font-medium text-fg">
                        {vehicleText(vehicle.name, locale)}
                      </p>
                      <p className="mt-1 break-keep text-xs text-fg-muted">
                        {vehicleText(vehicle.luggage, locale)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <Field label={t("pickupDate")} htmlFor="pickupDate">
                <input
                  id="pickupDate"
                  type="date"
                  required
                  value={form.pickupDate || form.checkIn}
                  onChange={(e) => update("pickupDate", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t("pickupTime")} htmlFor="pickupTime">
                <input
                  id="pickupTime"
                  type="time"
                  required
                  value={form.pickupTime}
                  onChange={(e) => update("pickupTime", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <p className="break-keep text-xs text-fg-subtle">{t("pickupTimeHint")}</p>
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
  hotels,
  holidays,
  locale,
  onReset,
}: {
  data: FormState;
  hotels: HotelOption[];
  holidays: string[];
  locale: string;
  onReset: () => void;
}) {
  const t = useTranslations("reserve");
  const [copied, setCopied] = useState(false);

  const hotel = hotels.find((h) => h.id === data.hotelId);
  const room = hotel?.rooms.find((r) => r.slug === data.roomSlug);
  const variant = room?.variants.find((v) => v.rateKey === data.rateKey) ?? room?.variants[0];
  const quote = variant
    ? quoteStay(variant, data.checkIn, data.checkOut, new Set(holidays), hotel?.info?.validFrom)
    : null;

  const summary = buildReservationSummaryText(
    {
      hotelName: hotel?.name ?? data.hotelId,
      roomName: room?.name ?? null,
      promoEligible: variant?.promo ?? false,
      rateName: variant?.label ?? null,
      nights: quote?.ok ? quote.nights : null,
      estimatedTotal: quote?.ok ? quote.total : null,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guestCount: data.guestCount,
      needsVehicle: data.needsVehicle,
      vehicleType: getVehicle(data.vehicleType)
        ? vehicleText(getVehicle(data.vehicleType)!.name, locale)
        : null,
      pickupLocation: data.pickupLocation,
      pickupDate: data.pickupDate || data.checkIn,
      pickupTime: data.pickupTime,
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

      {quote?.ok && (
        <div className="rounded-xl border border-border bg-bg px-4 py-4 text-left">
          <p className="text-xs text-fg-subtle">{t("estimateTitle")}</p>
          <p className="mt-1 text-lg font-semibold text-accent">{formatVnd(quote.total)}</p>
          <PriceDisclaimer className="mt-2" />
        </div>
      )}

      {variant?.promo && (
        <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm leading-relaxed text-accent">
          {t("promoSuccessNotice")}
        </p>
      )}

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

function HotelRoomPicker({
  hotels,
  hotelId,
  roomSlug,
  rateKey,
  onHotelChange,
  onRoomChange,
  onRateChange,
}: {
  hotels: HotelOption[];
  hotelId: string;
  roomSlug: string;
  rateKey: string;
  onHotelChange: (hotelId: string) => void;
  onRoomChange: (roomSlug: string) => void;
  onRateChange: (rateKey: string) => void;
}) {
  const t = useTranslations("reserve");
  const hotel = hotels.find((h) => h.id === hotelId);
  const selectedRoom = hotel?.rooms.find((r) => r.slug === roomSlug);
  const hasPromoRooms = hotel?.rooms.some((r) => r.promo) ?? false;
  const selectedVariant =
    selectedRoom?.variants.find((v) => v.rateKey === rateKey) ?? selectedRoom?.variants[0];
  const pricing = useTranslations("pricing");

  return (
    <div className="space-y-6">
      <Field label={t("hotel")}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {hotels.map((h) => (
            <label key={h.id} className="block cursor-pointer">
              <input
                type="radio"
                name="hotel"
                value={h.id}
                required
                checked={hotelId === h.id}
                onChange={() => onHotelChange(h.id)}
                className="peer sr-only"
              />
              <div className="flex items-center overflow-hidden rounded-xl border border-border bg-bg transition hover:border-border-strong peer-checked:border-accent peer-checked:ring-1 peer-checked:ring-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent sm:block">
                <div className="relative h-20 w-28 shrink-0 bg-bg-elevated-2 sm:h-auto sm:w-full sm:aspect-[4/3]">
                  <Image
                    src={h.cover}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 200px, 112px"
                    className="object-cover"
                  />
                </div>
                <p className="px-3 py-2.5 text-sm font-medium text-fg">{h.name}</p>
              </div>
            </label>
          ))}
        </div>
      </Field>

      <Field label={t("room")}>
        {hotel ? (
          <div className="space-y-3">
            <div
              role="radiogroup"
              aria-label={t("room")}
              className="max-h-[26rem] space-y-5 overflow-y-auto rounded-xl border border-border bg-bg p-3"
            >
              <label className="block cursor-pointer">
                <input
                  type="radio"
                  name="room"
                  value=""
                  checked={roomSlug === ""}
                  onChange={() => onRoomChange("")}
                  className="peer sr-only"
                />
                <div className="rounded-lg border border-border p-3 transition hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                  <p className="text-sm font-medium text-fg">{t("roomUndecided")}</p>
                  <p className="mt-0.5 text-xs text-fg-muted">{t("roomUndecidedHint")}</p>
                </div>
              </label>

              {hotel.categories.map((category) => {
                const rooms = hotel.rooms.filter((r) => r.category === category.key);
                if (rooms.length === 0) return null;
                return (
                  <div key={category.key}>
                    <p className="px-1 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                      {category.label}
                    </p>
                    <div className="mt-2 space-y-2">
                      {rooms.map((room) => (
                        <label key={room.slug} className="block cursor-pointer">
                          <input
                            type="radio"
                            name="room"
                            value={room.slug}
                            checked={roomSlug === room.slug}
                            onChange={() => onRoomChange(room.slug)}
                            className="peer sr-only"
                          />
                          <div className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-bg-elevated-2">
                              <Image
                                src={room.thumb}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-medium text-fg">
                                {room.name}
                              </p>
                              <p className="mt-0.5 text-xs text-fg-muted">{room.summary}</p>
                              {room.promo && (
                                <span className="mt-1.5 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                                  {t("promoBadge")}
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedRoom && (
              <Link
                href={`/hotels/${hotel.id}/rooms/${selectedRoom.slug}`}
                target="_blank"
                className="inline-block text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
              >
                {t("roomDetail")} →
              </Link>
            )}

            {selectedRoom && selectedRoom.variants.length > 1 && (
              <fieldset>
                <legend className="mb-2 text-sm text-fg-muted">{pricing("variant")}</legend>
                <div className="space-y-2">
                  {selectedRoom.variants.map((v) => (
                    <label key={v.rateKey} className="block cursor-pointer">
                      <input
                        type="radio"
                        name="rate"
                        value={v.rateKey}
                        checked={v.rateKey === selectedVariant?.rateKey}
                        onChange={() => onRateChange(v.rateKey)}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-sm text-fg transition hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                        <span className="break-words">{v.label}</span>
                        {v.promo && (
                          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                            {t("promoBadge")}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {selectedVariant?.promo ? (
              <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm leading-relaxed text-accent">
                {t("promoSelectedNotice")}
              </p>
            ) : (
              hasPromoRooms && (
                <p className="text-xs leading-relaxed text-fg-subtle">{t("promoLegend")}</p>
              )
            )}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-fg-subtle">
            {t("selectHotelFirst")}
          </p>
        )}
      </Field>
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
