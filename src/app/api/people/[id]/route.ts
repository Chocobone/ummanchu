import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - 특정 인물 정보 조회
export async function GET(request: Request, context: any) {
  const { params } = context;
  try {
    const person = await prisma.person.findUnique({
      where: { id: parseInt(params.id, 10) },
    });
    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    return NextResponse.json(person);
  } catch (error) {
    console.error(`Error fetching person with id: ${params.id}` , error);
    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}

// PUT - 특정 인물 정보 수정
export async function PUT(request: Request, context: any) {
  const { params } = context;
  try {
    const data = await request.json();
    const { name, position, description, image, email, degree, role } = data;

    const updatedPerson = await prisma.person.update({
      where: { id: parseInt(params.id, 10) },
      data: {
        name,
        position,
        description,
        image,
        email,
        degree,
        role,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error(`Error updating person with id: ${params.id}` , error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

// DELETE - 특정 인물 정보 삭제
export async function DELETE(request: Request, context: any) {
  const { params } = context;
  try {
    await prisma.person.delete({
      where: { id: parseInt(params.id, 10) },
    });
    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting person with id: ${params.id}` , error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}
