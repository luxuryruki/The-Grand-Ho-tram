-- Supabase는 public 스키마의 테이블을 anon/authenticated 키로 API(PostgREST)에서 읽고 쓸 수 있게 열어 둡니다.
-- 이 사이트는 서버(Prisma, 소유자 계정)로만 DB에 접근하므로, 모든 테이블에 RLS를 켜고 정책을 만들지 않아
-- 외부(anon 키)에서는 아무 데이터도 읽거나 쓸 수 없게 막습니다. 소유자 계정(Prisma)은 RLS의 영향을 받지 않습니다.
-- ※ 앞으로 테이블을 새로 만들면 같은 방식으로 RLS를 켜야 합니다.

ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsultationMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsultationSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GolfRateSheet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HotelRateInfo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HotelType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipInquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PublicHoliday" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReservationRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoomRate" ENABLE ROW LEVEL SECURITY;
