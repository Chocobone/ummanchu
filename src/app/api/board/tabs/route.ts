import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ✅ 본인 프로젝트 경로에 맞게 import
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: 모든 탭 조회
export async function GET() {
  try {
    const tabs = await prisma.boardTab.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(tabs);
  } catch (error) {
    console.error('Error fetching board tabs:', error);
    return NextResponse.json({ error: 'Failed to fetch board tabs' }, { status: 500 });
  }
}

// POST: 새 탭 생성
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 세션이 없으면 로그인 안된 상태
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const newTab = await prisma.boardTab.create({
      data: {
        name,
        slug,
        description,
        order: order ?? 0,
      },
    });

    return NextResponse.json(newTab);
  } catch (error) {
    console.error('Error creating board tab:', error);
    return NextResponse.json({ error: 'Failed to create board tab' }, { status: 500 });
  }
}