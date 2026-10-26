// 브라우저에서 이미지를 올리기 전에 줄입니다. Vercel 서버리스 함수는 요청 본문이 4.5MB를 넘으면 받지 못하기 때문에,
// 큰 사진/포스터는 긴 변 2400px 이내로 줄여서 JPEG(또는 WebP)로 다시 저장합니다. GIF와 이미 작은 파일은 그대로 둡니다.

const TARGET_BYTES = 3.5 * 1024 * 1024;
const MAX_SIDE = 2400;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function shrinkImage(file: File): Promise<File> {
  if (file.type === "image/gif" || file.size <= TARGET_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    let quality = 0.88;
    for (let attempt = 0; attempt < 6; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.fillStyle = "#ffffff"; // 투명한 PNG는 흰 배경으로 합칩니다
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await toBlob(canvas, "image/jpeg", quality);
      if (blob && blob.size <= TARGET_BYTES) {
        bitmap.close();
        const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        return new File([blob], name, { type: "image/jpeg" });
      }
      scale *= 0.85;
      quality = Math.max(0.6, quality - 0.06);
    }
    bitmap.close();
    return file;
  } catch {
    return file;
  }
}
