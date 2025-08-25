import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// GET - 모든 슬라이더 이미지 조회
export async function GET() {
  try {
    const sliderImages = await prisma.sliderImage.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(sliderImages);
  } catch (error) {
    console.error('Error fetching slider images:', error);
    return NextResponse.json({ error: 'Failed to fetch slider images' }, { status: 500 });
  }
}

// POST - 새 슬라이더 이미지 업로드 및 생성
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string || 'Slider Image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Define the path to save the file
    const savePath = path.join(process.cwd(), 'public/slider', filename);

    // Save the file to the filesystem
    await fs.writeFile(savePath, buffer);

    // Create a record in the database
    const imageUrl = `/slider/${filename}`; // The public URL path
    const newImage = await prisma.sliderImage.create({
      data: {
        imageUrl,
        altText,
        order: 0, // You might want to handle order differently
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error creating slider image:', error);
    return NextResponse.json({ error: 'Failed to create slider image' }, { status: 500 });
  }
}