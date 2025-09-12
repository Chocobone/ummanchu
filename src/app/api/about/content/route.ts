// app/api/about/content/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ▶ Prisma는 Node 런타임만
export const runtime = "nodejs";

// 기본값 (DB 없을 때 머지용)
const defaultAbout = {
  heading: "About Us",
  tagline: "Empowering cosmic discovery—one payload at a time.",
  body1: "Since ancient times, ...",
  body2: "Most of the people ...",
  professorName: "Dr. JongHo Seon",
  professorImageUrl: "/images/professor.png",
  highlightTitle: "",
  highlight1: "Recently, the Space Science payload lab ...",
  highlight2: "I hope that life in the space science ...",
  groupPhotoUrl: "/images/group-photo.jpg",
};

export async function GET() {
  try {
    const row = await prisma.aboutContent.findUnique({ where: { page: "about" } });
    const data = row?.data ? { ...defaultAbout, ...(row.data as any) } : defaultAbout;
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error("[GET /api/about/content] ", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = { ...defaultAbout, ...body };

    await prisma.aboutContent.upsert({
      where: { page: "about" },
      update: { data },
      create: { page: "about", data },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[PUT /api/about/content] ", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
