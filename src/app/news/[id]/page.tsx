// app/news/[id]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { unstable_noStore as noStore } from 'next/cache';
// SSG 시 필요한 파라미터 목록을 미리 생성
export async function generateStaticParams() {
  const newsItems = await prisma.news.findMany({
    select: { id: true },
  });
  return newsItems.map((item) => ({
    id: item.id,
  }));
}

// 이 컴포넌트는 반드시 async 로 선언해야 합니다!
export default async function NewsDetailPage({ params }: any) {
  noStore();
  const { id } = params;

  const news = await prisma.news.findUnique({
    where: { id: id },
  });

  if (!news) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <article className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* 제목 + 메타 */}
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">{news.title}</h1>
            <p className="text-sm text-foreground">
              Published on {new Date(news.publishedAt).toLocaleDateString()}
            </p>
          </header>

          {/* 대표 이미지 (높이 400px 고정) */}
          {news.imageUrl && (
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 본문 (max-w-4xl 로 이미지와 동일한 폭) */}
          <div 
            className="prose prose-invert mx-auto max-w-4xl"
            dangerouslySetInnerHTML={{ __html: news.description }}
          />
        </article>
      </div>
    </>
  );
}
