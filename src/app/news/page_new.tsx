// app/news/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Post } from "@/types/post";
export const dynamic = 'force-dynamic';
export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const result = await response.json();
        
        if (result.success) {
          setPosts(result.data || []);
        } else {
          setError(result.error || "데이터를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("네트워크 오류가 발생했습니다.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPreview = (content: string, maxLength: number = 100) => {
    // HTML 태그 제거
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-primary">NEWS</span>
            </h1>
            <p className="text-xl text-foreground/70">
              SSIL의 최신 소식과 공지사항을 확인하세요.
            </p>
          </header>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-lg text-foreground/70">뉴스를 불러오는 중...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-lg text-red-500 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* News Grid */}
          {!isLoading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-lg text-foreground/70 mb-4">등록된 뉴스가 없습니다.</div>
                  <Link 
                    href="/test"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                  >
                    첫 번째 글 작성하기
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-foreground/50 text-sm">SSIL NEWS</div>
                      </div>
                      <CardContent className="p-4 flex-grow space-y-2">
                        <h3 className="text-lg font-bold line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-foreground/70 line-clamp-3">
                          {getPreview(post.content)}
                        </p>
                      </CardContent>
                      <CardFooter className="px-4 pt-0 pb-4 flex flex-col">
                        <Link
                          href={`/news/${post.id}`}
                          className="text-primary font-semibold mb-2 hover:underline"
                        >
                          READ MORE »
                        </Link>
                        <hr className="border-t border-foreground/20 mb-2 w-full" />
                        <div className="text-sm text-foreground/70 w-full">
                          {post.author}
                          <span className="mx-2">&bull;</span>
                          {formatDate(post.createdAt)}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
