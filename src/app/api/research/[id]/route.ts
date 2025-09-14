
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(_req: Request, context: any) {
  try {
    const { id } = context.params;
    const item = await prisma.research.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) {
    console.error('GET /api/research/[id] error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = context.params;
    const body = await req.json();
    const { title, description, contentHtml, imageUrl, status, startDate, endDate } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const updated = await prisma.research.update({
      where: { id },
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
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    console.error('PUT /api/research/[id] error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    const { id } = context.params;
    await prisma.research.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    console.error('DELETE /api/research/[id] error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
