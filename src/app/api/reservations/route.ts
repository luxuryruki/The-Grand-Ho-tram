import { NextResponse } from "next/server";

/** 웹 예약 요청 접수는 종료되었습니다. 문의는 카카오톡(QR/오픈채팅)으로 받습니다. 이전 접수 내역은 관리자 화면에서 그대로 볼 수 있습니다. */
export async function POST() {
  return NextResponse.json(
    { error: "웹 예약 요청은 종료되었습니다. 카카오톡으로 문의해 주세요." },
    { status: 410 }
  );
}
