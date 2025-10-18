import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { defaultAbout } from "@/lib/aboutContent";

export async function GET() {
  const row = await prisma.aboutContent.findUnique({ where: { page: "about" } });
  const data = row?.data ? { ...defaultAbout, ...(row.data as any) } : defaultAbout;
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const data = { ...defaultAbout, ...body };

  await prisma.aboutContent.upsert({
    where: { page: "about" },
    update: { data },
    create: { page: "about", data },
  });

  return NextResponse.json({ ok: true });
}