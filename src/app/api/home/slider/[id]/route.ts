import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE - 특정 슬라이더 이미지 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await prisma.sliderImage.delete({
      where: { id },
    });

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting slider image with id: ${params.id}`, error);
    // P2025 is the Prisma code for record to delete not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete slider image' }, { status: 500 });
  }
}
