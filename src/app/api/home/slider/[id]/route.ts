import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
export const dynamic = 'force-dynamic';

// DELETE - 특정 슬라이더 이미지 삭제

const UPLOAD_PATH = process.env.UPLOAD_PATH

export async function DELETE(request: Request, context: any) {
  const { id } = context.params as { id: string };

  try {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

  // DB에서 레코드 찾기 (파일 경로 확인용)
    const image = await prisma.sliderImage.findUnique({
      where: { id: numId },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // 실제 파일 경로
    const relativePath = image.imageUrl.replace(/^\/?api\/files\//, "");
    console.log("Deleting file at path:", relativePath);
    const oldFilePath = path.join(UPLOAD_PATH, relativePath);
    const dirname = path.dirname(oldFilePath);
    const ext = path.extname(oldFilePath);
    const basename = path.basename(oldFilePath, ext);

    // 새로운 이름 (deleted- prefix 추가)
    const newFilename = `deleted-${basename}${ext}`;
    const newFilePath = path.join(dirname, newFilename);

    try {
      await fs.rename(oldFilePath, newFilePath);
      console.log(`Renamed file ${oldFilePath} → ${newFilePath}`);
    } catch (fileError: any) {
      console.warn("File not found or could not be renamed:", fileError.message);
      // 파일이 이미 없더라도 계속 진행 (DB는 삭제)
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