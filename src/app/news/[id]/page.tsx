import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import PageLayout from "@/components/PageLayout";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const newsItems = await prisma.news.findMany({
    select: { id: true },
  });
  return newsItems.map((item) => ({ id: item.id }));
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  noStore();
  const { id } = params;

  const news = await prisma.news.findUnique({
    where: { id },
  });

  if (!news) notFound();

  return (
    <PageLayout>
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* 제목 */}
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">{news.title}</h1>
            <p className="text-sm text-muted-foreground">
              Published on {new Date(news.publishedAt).toLocaleDateString()}
            </p>
          </header>

          {/* 대표 이미지 */}
          {news.imageUrl && (
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-sm">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 본문 */}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: news.description || "" }}
          />
        </article>
    </PageLayout>
  );
}
