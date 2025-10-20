import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/news
export async function GET() {
  try {
    const items = await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error('Error fetching news:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/news (인증 검사 없음)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, publishedAt } = body ?? {};

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const created = await prisma.news.create({
      data: {
        title,
        description,
        imageUrl: imageUrl ?? null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('Error creating news:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
