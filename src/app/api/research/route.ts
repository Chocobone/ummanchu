import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

// POST a new research item
export async function POST(request: Request) {
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

    const newResearch = await prisma.research.create({
      data: {
        title,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(newResearch, { status: 201 });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
