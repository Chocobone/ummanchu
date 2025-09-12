import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

// GET - 모든 인물 정보 조회
export async function GET() {
  try {
    const people = await prisma.person.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

// POST - 새 인물 정보 생성
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, position, description, image, email, degree, role } = data;

    if (!name || !position || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPerson = await prisma.person.create({
      data: {
        name,
        position,
        description,
        image,
        email,
        degree,
        role,
      },
    });
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    console.error('Error creating person:', error);
    // P2002 is the Prisma code for a unique constraint violation
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}