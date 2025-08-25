// app/news/page.tsx
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import prisma from "@/lib/prisma";

// Helper function to strip HTML and truncate text
function createPreview(html: string, length: number = 100) {
  const text = html.replace(/<[^>]*>/g, ''); // Strip HTML tags
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "…";
}

export default async function NewsPage() {
  const newsItems = await prisma.news.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <header className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="">NEWS</span>
              </h1>
              <p className="text-xl text-white/80">
                SSIL의 최신 소식과 공지사항을 확인하세요.
              </p>
            </header>

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 bg-card/20 border-white/10"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={item.imageUrl || "/images/news_placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4 flex-grow space-y-2">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-white/70 line-clamp-3">
                      {createPreview(item.description)}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 mt-auto">
                    <div className="w-full">
                      <div className="text-xs text-white/50 mb-2">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </div>
                      <Link
                        href={`/news/${item.id}`}
                        className="text-yellow-400 font-semibold text-sm hover:underline"
                      >
                        READ MORE »
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
