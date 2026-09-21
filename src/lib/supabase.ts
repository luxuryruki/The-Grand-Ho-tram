import "server-only";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다. .env를 확인하세요.`);
  }
  return value;
}

/**
 * service_role 키를 사용하는 서버 전용 Supabase 클라이언트.
 * 관리자 이미지 업로드처럼 서버(Route Handler)에서만 사용해야 하며,
 * 절대 클라이언트 컴포넌트로 값을 내려보내면 안 됩니다.
 */
export function getSupabaseAdminClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

/** 이벤트 이미지를 Supabase Storage의 공개 버킷에 업로드하고 공개 URL을 반환합니다. */
export async function uploadEventImage(
  file: File,
  eventId: string
): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "event-images";
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${eventId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Supabase Storage 업로드 실패: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** 이미지 삭제 시 best-effort로 Storage 원본도 함께 지웁니다 (실패해도 무시). */
export async function deleteEventImageFile(publicUrl: string) {
  try {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "event-images";
    const marker = `/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
    const supabase = getSupabaseAdminClient();
    await supabase.storage.from(bucket).remove([path]);
  } catch (err) {
    console.warn("[supabase] 이미지 파일 삭제 실패 (무시하고 진행)", err);
  }
}
