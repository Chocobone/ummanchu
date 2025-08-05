// app/news/[id]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/Header";

interface NewsItem {
  title: string;
  preview: string;
  body: string;
  image: string;
  author: string;
  date: string;
  link: string; // ex: "/news/1"
}

const newsItems: NewsItem[] = [
  {
    title: "SSIL, 차세대 우주장비 연구 착수",
    preview:
      "우주과학탑재체연구실(SSIL)이 새로운 우주장비 프로토타입 개발 프로젝트를 시작했습니다.…",
    body: `
우주과학탑재체연구실(SSIL)이 새로운 우주장비 프로토타입 개발 프로젝트를 시작했습니다. 이번 프로젝트에서는 차세대 입자 검출기 개발을 목표로 하며, 다양한 국제 파트너와 협업하여 2026년까지 시험 발사를 계획하고 있습니다. 해당 연구를 통해 우주 환경에 대한 새로운 인사이트를 얻고자 합니다.
    `.trim(),
    image: "/images/news1.png",
    author: "Igen Soske",
    date: "May 6, 2025",
    link: "/news/1",
  },
  {
    title: "천문대 공개 관측 행사 안내",
    preview:
      "경희대 국제캠퍼스 천문대에서 8월 15일 공개 관측 행사를 엽니다. 누구나 무료로 참여 가능하며,…",
    body: `
경희대 국제캠퍼스 천문대에서 8월 15일 오후 8시부터 오픈 하우스 형식의 공개 관측 행사를 개최합니다.
망원경 시연, 전문가 강연, 별자리 해설 등 다채로운 프로그램이 준비되어 있으니 많은 참여 바랍니다.
    `.trim(),
    image: "/images/news2.png",
    author: "Igen Soske",
    date: "July 15, 2025",
    link: "/news/2",
  },
  {
    title: "우주탐사 X-프로젝트 중간 결과 발표",
    preview:
      "국제 우주탐사 X-프로젝트의 중간 보고서가 공개되었습니다. 주요 성과는 …",
    body: `
국제 공동으로 진행 중인 우주탐사 X-프로젝트의 중간 결과 보고서가 공개되었습니다.
탑재체 성능 테스트에서 목표치 대비 120% 성능을 달성했으며, 다음 단계로 심층 분석을 앞두고 있습니다.
    `.trim(),
    image: "/images/news3.png",
    author: "Igen Soske",
    date: "September 20, 2025",
    link: "/news/3",
  },
];

type Props = { params: { id: string } };

// SSG 시 필요한 파라미터 목록을 미리 생성
export function generateStaticParams() {
  return newsItems.map((item) => {
    const id = item.link.split("/").pop()!;
    return { id };
  });
}

// 이 컴포넌트는 반드시 async 로 선언해야 합니다!
export default async function NewsDetailPage({ params }: Props) {
  // ★ 여기서 await params 를 해 주셔야 Next.js 14 에러가 사라집니다.
  const { id } = await params;

  // URL 에 맞는 뉴스 찾기
  const news = newsItems.find((n) => n.link === `/news/${id}`);
  if (!news) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <article className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 제목 + 메타 */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{news.title}</h1>
          <p className="text-sm text-foreground/70">
            {news.author} · {news.date}
          </p>
        </header>

        {/* 대표 이미지 (높이 400px 고정) */}
        <div className="w-full overflow-hidden rounded-lg max-h-[400px]">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 본문 (max-w-4xl 로 이미지와 동일한 폭) */}
          <div className="prose prose-invert mx-auto max-w-4xl">
          {news.body.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
