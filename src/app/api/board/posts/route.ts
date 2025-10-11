import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ✅ 전체 게시글 조회 (탭별 필터 가능)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tabId = searchParams.get('tabId');

    const posts = await prisma.boardPost.findMany({
      where: tabId ? { tabId: Number(tabId) } : {},
      include: { tab: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching board posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// ✅ 게시글 생성 (로그인 + 관리자만)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, imageUrl, tabId, publishedAt } = body;

    if (!title || !tabId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.boardPost.create({
      data: {
        title,
        description,
        imageUrl,
        tabId: Number(tabId),
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        published: true,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating board post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}