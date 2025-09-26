// app/api/publication/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: any) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const pub = await prisma.publication.findUnique({ where: { id } });
  if (!pub) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(pub);
}

export async function PUT(req: NextRequest, { params }: any) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const data = await req.json();
  const updated = await prisma.publication.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await prisma.publication.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
