import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

// GET a specific news item by ID
export async function GET(request: Request, context: any) {
  // Acknowledge request to satisfy Next.js static analysis
  const _ = request.method;
  try {
    const { id } = context.params;
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error(`Error fetching news ${context.params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a specific news item by ID (Admin protected)
export async function PUT(request: Request, context: any) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, description, imageUrl, publishedAt } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const updatedNews = await prisma.news.update({
      where: { id: context.params.id },
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error(`Error updating news ${context.params.id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a specific news item by ID (Admin protected)
export async function DELETE(request: Request, context: any) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Acknowledge request to satisfy Next.js static analysis
  const _ = request.method;
  try {
    const { id } = context.params;
    await prisma.news.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting news ${context.params.id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
