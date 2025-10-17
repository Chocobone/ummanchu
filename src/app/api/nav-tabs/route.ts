import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tabs = await prisma.boardTab.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return NextResponse.json(tabs);
  } catch (error) {
    console.error("❌ Failed to load BoardTabs:", error);
    return NextResponse.json({ error: "Failed to fetch tabs" }, { status: 500 });
  }
}