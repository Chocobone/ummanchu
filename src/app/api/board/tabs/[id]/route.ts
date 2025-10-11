import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// PUT: 탭 수정
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const { name, slug, description, order } = body;
    
    const session = await getServerSession(authOptions);
    
    // 세션이 없으면 로그인 안된 상태
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const updatedTab = await prisma.boardTab.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        order,
      },
    });

    return NextResponse.json(updatedTab);
  } catch (error) {
    console.error('Error updating board tab:', error);
    return NextResponse.json({ error: 'Failed to update board tab' }, { status: 500 });
  }
}

// DELETE: 탭 삭제
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const session = await getServerSession(authOptions);
    
    // 세션이 없으면 로그인 안된 상태
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.boardTab.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board tab:', error);
    return NextResponse.json({ error: 'Failed to delete board tab' }, { status: 500 });
  }
}