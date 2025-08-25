import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs/promises';
import path from 'path';

interface Params {
  params: {
    id: string;
  };
}

// GET a specific research item by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const research = await prisma.research.findUnique({
      where: { id },
    });

    if (!research) {
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }

    return NextResponse.json(research);
  } catch (error) {
    console.error(`Error fetching research ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a specific research item by ID
export async function PUT(request: Request, { params }: Params) {
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

    const dataToUpdate: any = {
      title,
      subtitle,
      description,
      status,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    if (file) {
      const researchId = params.id;
      const uploadDir = path.join(process.cwd(), 'public/research', researchId);
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const savePath = path.join(uploadDir, filename);

      await fs.writeFile(savePath, buffer);
      dataToUpdate.imageUrl = `/research/${researchId}/${filename}`;
    }

    const updatedResearch = await prisma.research.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedResearch);
  } catch (error) {
    console.error(`Error updating research ${params.id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a specific research item by ID
export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;
    // Optional: Delete the associated folder and its contents
    const uploadDir = path.join(process.cwd(), 'public/research', id);
    await fs.rm(uploadDir, { recursive: true, force: true });

    await prisma.research.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting research ${params.id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}