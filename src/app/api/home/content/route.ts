import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
const contentId = 1;

// GET - 홈 페이지 텍스트 콘텐츠 조회
export async function GET() {
  try {
    let content = await prisma.homePageContent.findUnique({
      where: { id: contentId },
    });

    // If no content exists, create it with default values
    if (!content) {
      content = await prisma.homePageContent.create({
        data: {
          id: contentId,
          heroTitle: 'SSIL',
          heroSubtitle: 'Space Science Instrument Laboratory',
          heroParagraph: 'From time immemorial, people have expressed a wide spectrum of interest in outer space—ranging from a vague longing to a passing curiosity. We now live in an age where space travel is no longer a distant dream. Yet despite—and indeed because of—these advances, there is a growing demand for a rigorous scientific understanding of cosmic phenomena, which in turn requires diverse observational data gathered from space. The Space Science Instrument Laboratory (SSIL) is dedicated to research precisely focused on meeting this need.',
          aboutTitle: 'Empowering cosmic discovery—one payload at a time.',
          aboutParagraph: 'Since ancient times, people have expressed a variety of interests, ranging from vague admiration for the universe to a brief curiosity. Now, even space travel has reached a time when it is no longer an imagination. Despite these times, and also in these times, people need more scientific understanding of cosmic phenomena, which requires various kinds of observational data in outer space. The Space Science Instrument Laboratory (SSIL) focuses on this research.',
          newsTitle: 'NEWS',
          newsSubtitle: 'SSIL의 최신 소식과 공지사항을 확인하세요.',
        }
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching home page content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT - 홈 페이지 텍스트 콘텐츠 수정 (Upsert)
export async function PUT(request: Request) {
  try {
    const data = await request.json();

    const updatedContent = await prisma.homePageContent.upsert({
      where: { id: contentId },
      update: data,
      create: {
        id: contentId,
        ...data,
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating home page content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
