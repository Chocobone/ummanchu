// app/news/page.tsx
"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface NewsItem {
  title: string;
  preview: string;
  image: string;
  author: string;
  date: string;
  link: string;
}

const newsItems: NewsItem[] = [
  {
    title: "SSIL, 차세대 우주장비 연구 착수",
    preview:
      "우주과학탑재체연구실(SSIL)이 새로운 우주장비 프로토타입 개발 프로젝트를 시작했습니다.…",
    image: "/images/news1.png",
    author: "Igen Soske",
    date: "May 6, 2025",
    link: "/news/1",
  },
  {
    title: "천문대 공개 관측 행사 안내",
    preview:
      "경희대 국제캠퍼스 천문대에서 8월 15일 공개 관측 행사를 엽니다. 누구나 무료로 참여 가능하며,…",
    image: "/images/news2.png",
    author: "Igen Soske",
    date: "May 6, 2025",
    link: "/news/2",
  },
  {
    title: "우주탐사 X-프로젝트 중간 결과 발표",
    preview:
      "국제 우주탐사 X-프로젝트의 중간 보고서가 공개되었습니다. 주요 성과는 …",
    image: "/images/news3.png",
    author: "Igen Soske",
    date: "May 6, 2025",
    link: "/news/3",
  },
];

export default function NewsPage() {
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

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, idx) => (
              <Card
                key={idx}
                className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* 1) 썸네일 */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />

                {/* 2) 본문 */}
                <CardContent className="p-4 flex-grow space-y-2">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-foreground/70 line-clamp-2">
                    {item.preview}
                  </p>
                </CardContent>

                {/* 3) Footer: READ MORE + 구분선 + 저자·날짜 */}
                <CardFooter className="px-4 pt-0 pb-4 flex flex-col">
                  <Link
                    href={item.link}
                    className="text-yellow-400 font-semibold mb-2"
                  >
                    READ MORE »
                  </Link>
                  <hr className="border-t border-gray-700 mb-2" />
                  <div className="text-sm text-foreground/70">
                    {item.author}
                    <span className="mx-2">&bull;</span>
                    {item.date}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
