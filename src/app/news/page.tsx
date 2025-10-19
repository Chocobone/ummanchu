import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Navbar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { unstable_noStore as noStore } from "next/cache";

function createPreview(html: string, length: number = 100) {
  const text = html.replace(/<[^>]*>/g, "");
  return text.length <= length ? text : text.substring(0, length) + "…";
}

export default async function NewsPage() {
  noStore();
  const newsItems = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <div className="min-h-screen bg-white text-foreground transition-colors dark:bg-neutral-950">
        <div className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-border">
          <Header />
        </div>

        <main className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-20">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                NEWS
              </h1>
              <p className="text-lg text-gray-600">
                Stay up to date with the latest news and announcements from SSIL.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {newsItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl"
                >
                  <div className="relative w-full h-52 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5 flex flex-col flex-grow space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {createPreview(item.description)}
                    </p>
                  </CardContent>

                  <CardFooter className="px-5 pb-5 pt-0 mt-auto">
                    <div className="w-full flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/news/${item.id}`}
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        READ MORE →
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
