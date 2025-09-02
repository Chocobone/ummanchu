import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';

export const runtime = 'nodejs';

// 타입: params가 Promise가 된 점을 반영
type ParamsPromise = Promise<{ id: string }>;

export async function GET(request: Request, ctx: { params: ParamsPromise }) {
  try {
    const { id } = await ctx.params; // 👈 반드시 await
    const research = await prisma.research.findUnique({ where: { id } });
    if (!research) return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    return NextResponse.json(research, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET research error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, ctx: { params: ParamsPromise }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await ctx.params; // 👈 await
    const formData = await request.formData();
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const contentHtmlRaw = formData.get('contentHtml') as string | null;
    const status = formData.get('status') as 'IN_PROGRESS' | 'COMPLETED' | null;
    const startDate = formData.get('startDate') as string | null;
    const endDate = formData.get('endDate') as string | null;
    const published = formData.get('published') ? (formData.get('published') as string) === 'true' : undefined;
    const file = formData.get('file') as File | null;

    const dataToUpdate: any = {};
    if (title !== null) dataToUpdate.title = title;
    if (description !== null) dataToUpdate.description = description;
    if (typeof published !== 'undefined') dataToUpdate.published = published;
    if (status) dataToUpdate.status = status;
    dataToUpdate.startDate = startDate ? new Date(startDate) : null;
    dataToUpdate.endDate = endDate ? new Date(endDate) : null;

    if (contentHtmlRaw !== null) {
      dataToUpdate.contentHtml = DOMPurify.sanitize(contentHtmlRaw, { USE_PROFILES: { html: true } });
    }

    if (file) {
      const uploadDir = path.join(process.cwd(), 'public/research', id);
      await fs.mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/[^\w.\-]/g, '_');
      const filename = `${Date.now()}_${safeName}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      dataToUpdate.imageUrl = `/research/${id}/${filename}`;
    }

    const updated = await prisma.research.update({ where: { id }, data: dataToUpdate });
    return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    console.error('PUT research error:', error);
    if (error?.code === 'P2025') return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: { params: ParamsPromise }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await ctx.params; // 👈 await
    // 파일 폴더 정리(선택)
    const uploadDir = path.join(process.cwd(), 'public/research', id);
    await fs.rm(uploadDir, { recursive: true, force: true });

    await prisma.research.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('DELETE research error:', error);
    if (error?.code === 'P2025') return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}