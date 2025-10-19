import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import NewsClient from "./NewsClient";
import Header from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  noStore();

  const newsItems = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-neutral-950">
      <div className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-border">
        <Header />
      </div>

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsClient initialNews={newsItems} />
        </div>
      </main>
    </div>
  );
}
