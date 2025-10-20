import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import PageLayout from "@/components/PageLayout";
import NewsDetailClient from "./_client";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const newsItems = await prisma.news.findMany({ select: { id: true } });
  return newsItems.map((item) => ({ id: item.id }));
}

export default async function NewsDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { edit?: string };
}) {
  noStore();

  const news = await prisma.news.findUnique({ where: { id: params.id } });
  if (!news) notFound();

  const publishedDateStr = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(news.publishedAt));

  return (
    <PageLayout>
      <NewsDetailClient
        startInEdit={searchParams?.edit === "1"}
        initialItem={{
          id: news.id,
          title: news.title,
          description: news.description ?? "",
          contentHtml: (news as any).contentHtml ?? null,
          imageUrl: news.imageUrl ?? null,
          publishedAt: news.publishedAt.toISOString(),
          publishedDateStr,
        }}
      />
    </PageLayout>
  );
}