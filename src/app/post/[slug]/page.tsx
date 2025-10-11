// app/post/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { unstable_noStore as noStore } from "next/cache";

// 🧩 Helper: HTML 태그 제거 + 미리보기 생성
function createPreview(html: string, length: number = 100) {
  const text = html.replace(/<[^>]*>/g, ""); // Strip HTML
  if (text.length <= length) return text;
  return text.substring(0, length) + "…";
}

export default async function BoardCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  noStore();

  // ✅ 탭(카테고리) + 게시글 가져오기
  const tab = await prisma.boardTab.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!tab) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">존재하지 않는 카테고리입니다.</p>
        </main>
      </>
    );
  }

  const posts = tab.posts;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary-rgb/20">
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 🧱 Page Header */}
            <header className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {tab.name.toUpperCase()}
              </h1>
              {tab.description && (
                <p className="text-xl text-foreground-rgb/80">{tab.description}</p>
              )}
            </header>

            {/* 🧱 게시글 그리드 */}
            {posts.length === 0 ? (
              <p className="text-center text-gray-500">게시글이 없습니다.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((item) => (
                  <Card
                    key={item.id}
                    className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 bg-card-rgb/20 border border-border-rgb/10"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-full h-48">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* 본문 */}
                    <CardContent className="p-4 flex-grow space-y-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground-rgb/70 line-clamp-3">
                        {createPreview(item.description || "")}
                      </p>
                    </CardContent>

                    {/* 푸터 */}
                    <CardFooter className="p-4 pt-0 mt-auto">
                      <div className="w-full">
                        <div className="text-xs text-foreground-rgb/50 mb-2">
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString()
                            : ""}
                        </div>
                        <Link
                          href={`/post/${tab.slug}/${item.id}`}
                          className="text-primary font-semibold text-sm hover:text-primary-rgb/90 hover:underline"
                        >
                          READ MORE »
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}