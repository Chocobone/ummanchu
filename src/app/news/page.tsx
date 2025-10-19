import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import NewsClient from "./NewsClient";
import PageLayout from "@/components/PageLayout";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  noStore();

  const newsItems = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsClient initialNews={newsItems} />
        </div>
    </PageLayout>
  );
}
