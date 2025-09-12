// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

// 기본값 (없을 때 자동 생성/머지용)
const DEFAULT_CONTACT = {
  labNameKo: "우주과학탐재체연구실",
  labNameEn: "Space Science Instrument Laboratory",
  addressKo:
    "(우)17104 경기도 용인시 기흥구 덕영대로 1732\n경희대학교 국제캠퍼스 천문대",
  addressEn:
    "Kyung Hee University Global Campus Observatory\n1732 Deogyeong-daero, Giheung-gu, Yongin-si, Gyeonggi-do 17104, Korea",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=", // 사용 중인 임베드 URL로 교체 가능
};

export async function GET() {
  try {
    // 단일 레코드(id=1) 운용
    const row = await prisma.contact.findUnique({ where: { id: 1 } });
    if (!row) {
      // 없으면 생성해서 리턴
      const created = await prisma.contact.create({
        data: { id: 1, ...DEFAULT_CONTACT },
      });
      return NextResponse.json(created, { status: 200 });
    }
    return NextResponse.json(row, { status: 200 });
  } catch (e) {
    console.error("[GET /api/contact]", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 아주 가벼운 유효성 검사 (필요하면 zod로 강화)
    const data = {
      labNameKo: String(body.labNameKo ?? DEFAULT_CONTACT.labNameKo),
      labNameEn: String(body.labNameEn ?? DEFAULT_CONTACT.labNameEn),
      addressKo: String(body.addressKo ?? DEFAULT_CONTACT.addressKo),
      addressEn: String(body.addressEn ?? DEFAULT_CONTACT.addressEn),
      mapEmbedUrl: String(body.mapEmbedUrl ?? DEFAULT_CONTACT.mapEmbedUrl),
    };

    await prisma.contact.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[PUT /api/contact]", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
