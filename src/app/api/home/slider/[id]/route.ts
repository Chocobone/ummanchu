import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// DELETE - 특정 슬라이더 이미지 삭제
export async function DELETE(request: Request, context: any) {
  const { id } = context.params as { id: string };

  try {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await prisma.sliderImage.delete({
      where: { id: numId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error deleting slider image with id: ${id}`, error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete slider image" },
      { status: 500 }
    );
  }
}