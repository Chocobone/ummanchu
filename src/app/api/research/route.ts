// research/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
export const dynamic = 'force-dynamic';
import fs from 'fs/promises';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';

export const runtime = 'nodejs';

// GET all research items
export async function GET() {
  try {
    const research = await prisma.research.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(research, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new research item with file upload
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const contentHtmlRaw = formData.get('contentHtml') as string | null; // 🔹추가
    const status = formData.get('status') as 'IN_PROGRESS' | 'COMPLETED';
    const startDate = formData.get('startDate') as string | null;
    const endDate = formData.get('endDate') as string | null;
    const published = (formData.get('published') as string | null) === 'true'; // 옵션
    const file = formData.get('file') as File | null;

    if (!title || !status) {
      return NextResponse.json({ error: 'Title and status are required' }, { status: 400 });
    }

    // 서버에서 sanitize (XSS 방지)
    const contentHtml = contentHtmlRaw
      ? DOMPurify.sanitize(contentHtmlRaw, { USE_PROFILES: { html: true } })
      : null;

    // 1) 이미지 없이 먼저 생성
    let newResearch = await prisma.research.create({
      data: {
        title,
        description: description ?? null,
        contentHtml,                    // 🔹추가
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        published,                      // 🔹옵션
      },
    });

    // 2) 파일 있으면 저장
    if (file) {
      const researchId = newResearch.id;
      const uploadDir = path.join(process.cwd(), 'public/research', researchId);
      await fs.mkdir(uploadDir, { recursive: true });

      // 파일명 안전 처리(공백/슬래시 제거)
      const safeName = file.name.replace(/[^\w.\-]/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      const savePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(savePath, buffer);

      const imageUrl = `/research/${researchId}/${filename}`;

      // 3) imageUrl 업데이트
      newResearch = await prisma.research.update({
        where: { id: researchId },
        data: { imageUrl },
      });
    }

    return NextResponse.json(newResearch, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}