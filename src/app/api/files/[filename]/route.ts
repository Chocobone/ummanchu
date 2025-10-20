// app/api/files/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const READ_PATH = process.env.READ_PATH

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Prevent directory traversal by normalizing and validating the filename
    const filename = (await params).filename;
    console.log('Requested filename:', filename);
    const safeFilename = path.basename(filename);
    const filePath = path.join(READ_PATH, safeFilename);
    // 간단히 MIME 추정 (확장자 기준)
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.bmp') contentType = 'image/bmp';
    else if (ext === '.tiff' || ext === '.tif') contentType = 'image/tiff';
    const buffer = await fs.readFile(filePath);
    
    return new NextResponse(new Uint8Array(buffer), {
      headers: { 'Content-Type': contentType },
    });
    
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'File not found' },
      { status: 404 }
    );
  }
}