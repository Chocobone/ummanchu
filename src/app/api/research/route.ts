import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import fs from 'fs/promises';
import path from 'path';

// GET all research items
export async function GET() {
  try {
    const research = await prisma.research.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(research);
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
    const subtitle = formData.get('subtitle') as string | null;
    const description = formData.get('description') as string;
    const status = formData.get('status') as 'IN_PROGRESS' | 'COMPLETED';
    const startDate = formData.get('startDate') as string | null;
    const endDate = formData.get('endDate') as string | null;
    const file = formData.get('file') as File | null;

    if (!title || !description || !status) {
      return NextResponse.json({ error: 'Title, description, and status are required' }, { status: 400 });
    }

    // 1. Create the research item without the image URL first to get an ID
    let newResearch = await prisma.research.create({
      data: {
        title,
        subtitle,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // 2. If there is a file, create a folder and save the image
    if (file) {
      const researchId = newResearch.id;
      const uploadDir = path.join(process.cwd(), 'public/research', researchId);
      
      // Create directory if it doesn't exist
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const savePath = path.join(uploadDir, filename);

      await fs.writeFile(savePath, buffer);

      const imageUrl = `/research/${researchId}/${filename}`;

      // 3. Update the research item with the imageUrl
      newResearch = await prisma.research.update({
        where: { id: researchId },
        data: { imageUrl },
      });
    }

    return NextResponse.json(newResearch, { status: 201 });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}