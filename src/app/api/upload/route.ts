// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const ownerType = (form.get('ownerType') as string | null) ?? 'MISC';
    const ownerId = form.get('ownerId') as string | null;   // 새 글 작성 중이면 null일 수도 있음
    const tag = (form.get('tag') as string | null) ?? null; // 'cover' | 'inline' 등

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');

    const safeName = file.name.replace(/[^\w.\-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;

    // /public/uploads/RESEARCH/2025/08
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', ownerType, String(y), String(m));
    await fs.mkdir(uploadDir, { recursive: true });

    const savePath = path.join(uploadDir, filename);
    await fs.writeFile(savePath, buffer);

    const url = `/uploads/${ownerType}/${y}/${m}/${filename}`;

    // 🔹 DB 매핑(선택) — ownerId가 있을 때만 기록(수정 페이지에서 유용)
    if (ownerId && (ownerType === 'RESEARCH' || ownerType === 'NEWS')) {
      await prisma.asset.create({
        data: {
          url,
          originalName: file.name,
          mime: file.type,
          size: buffer.length,
          ownerType: ownerType as any,
          ownerId,
          tag,
        },
      });
    }

    return NextResponse.json({ url }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}