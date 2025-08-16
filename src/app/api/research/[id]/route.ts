import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    const body = await request.json();
    const { title, description, status, startDate, endDate } = body;

    if (!title || !description || !status) {
      return NextResponse.json({ error: 'Title, description, and status are required' }, { status: 400 });
    }

    const updatedResearch = await prisma.research.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
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
