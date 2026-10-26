import { useTranslations } from "next-intl";
import { MemberNotice } from "@/components/membership/member-notice";
import { LinkButton } from "@/components/ui/button";

/** 요금 표시를 끈 동안 객실 상세에 보이는 영역: 요금 대신 회원가 안내와 문의 버튼만 둡니다. */
export function RoomInquiry({ hotelId, roomSlug }: { hotelId: string; roomSlug: string }) {
  const t = useTranslations("hotels");
  const source = encodeURIComponent(`room:${hotelId}/${roomSlug}`);
  return (
    <div className="mt-8 space-y-5">
      <MemberNotice />
      <LinkButton href={`/inquiry?source=${source}`} size="lg" className="w-full sm:w-auto">
        {t("roomReserveCta")}
      </LinkButton>
    </div>
  );
}
