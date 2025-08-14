// File: app/api/people/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Prisma client

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Loop through each tab category
    const allTabs = ['Professor', 'Current', 'Alumni'] as const;

    // 삭제 후 새로 저장 방식 (간단)
    await prisma.person.deleteMany();

    for (const tab of allTabs) {
      const profiles = data[tab] || [];
      for (const profile of profiles) {
        await prisma.person.create({
          data: {
            name: profile.name,
            category: tab,
            position: profile.position,
            description: profile.description,
            email: profile.email,
            phonenumber: profile.phonenumber,
            degree: profile.degree,
            career: profile.career,
            image: profile.image,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/people]', err);
    return NextResponse.json({ error: 'Failed to save people' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const people = await prisma.person.findMany();

    const result: Record<'Professor' | 'Current' | 'Alumni', any[]> = {
      Professor: [],
      Current: [],
      Alumni: [],
    };

    for (const person of people) {
      result[person.category].push(person);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/people]', err);
    return NextResponse.json({ error: 'Failed to load people' }, { status: 500 });
  }
}
