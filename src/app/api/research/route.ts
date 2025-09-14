import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all
export async function GET() {
  try {
    const items = await prisma.research.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/research error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create (JSON body, 권한체크 없음)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, contentHtml, imageUrl, status, startDate, endDate } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const created = await prisma.research.create({
      data: {
        title,
        description: description ?? null,
        contentHtml: contentHtml ?? null,
        imageUrl: imageUrl ?? null,
        status: status ?? 'IN_PROGRESS',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/research error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
