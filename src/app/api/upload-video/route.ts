import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "No file received" },
      { status: 400 }
    );
  }

  // file.name, file.size, file.type 사용 가능
  console.log("받은 파일:", file.name, file.size, file.type);

  // 여기에 너 원하는 처리를 넣으면 됨
  // ex: S3 업로드
  // ex: ffmpeg 서버에서 돌리기
  // ex: 파이썬 서버로 보내기 등등

  return NextResponse.json({ ok: true });
}
