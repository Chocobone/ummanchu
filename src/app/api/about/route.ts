import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// 기본값 (DB에 없을 때 표시될 초기 컨텐츠)
const defaultAbout = {
  heading: "About Us",
  tagline: "Empowering cosmic discovery—one payload at a time.",
  body1:
    "Since ancient times, people have expressed a variety of interests ... The Space Science Instrument Laboratory (SSIL) focuses on this research.",
  body2:
    "Most of the people who have been with us in the Space Science Embedded Laboratory continue to work in the space science industry ...",
  professorName: "Dr. JongHo Seon",
  professorImageUrl: "/images/professor.png",
  highlightTitle: "", // 필요 시 사용
  highlight1:
    "Recently, the Space Science payload lab has been involved in the CLPS project ...",
  highlight2:
    "I hope that life in the space science payload laboratory will serve as a springboard ...",
  groupPhotoUrl: "/images/group-photo.jpg",
};

export async function GET() {
  const row = await prisma.aboutContent.findUnique({ where: { page: "about" } });
  const data = row?.data ? { ...defaultAbout, ...(row.data as any) } : defaultAbout;
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  // 아주 간단한 검증 (필요하면 zod로 강화)
  const data = { ...defaultAbout, ...body };

  await prisma.aboutContent.upsert({
    where: { page: "about" },
    update: { data },
    create: { page: "about", data },
  });

  return NextResponse.json({ ok: true });
}
