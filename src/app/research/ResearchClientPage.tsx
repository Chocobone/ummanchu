'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { Research } from '@prisma/client';
export const dynamic = 'force-dynamic';
interface ResearchData {
  Current: Research[];
  Completed: Research[];
}

interface ResearchClientPageProps {
  researchData: ResearchData;
}

export default function ResearchClientPage({ researchData }: ResearchClientPageProps) {
  const params = useSearchParams();
  const catParam = params.get("cat") || "Current";
  const idxParam = parseInt(params.get("idx") || "0", 10);

  const categories = Object.keys(researchData);
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number>(isNaN(idxParam) ? 0 : idxParam);

  useEffect(() => {
    if (categories.includes(catParam)) setSelectedCategory(catParam);
    setSelectedProjectIdx(isNaN(idxParam) ? 0 : idxParam);
  }, [catParam, idxParam, categories]);

  const project =
    researchData[selectedCategory]?.[selectedProjectIdx] ||
    researchData["Current"]?.[0] || null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 메인 타이틀 */}
            <header className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Research
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 좌측 네비게이션 */}
              <nav className="space-y-6">
                {categories.map((cat) => (
                  <div key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedProjectIdx(0);
                      }}
                      className={`block w-full text-left py-2 px-4 rounded transition ${
                        selectedCategory === cat
                          ? "bg-primary/20 text-primary font-semibold"
                          : "bg-background/10 text-foreground/70 hover:bg-background/20"
                      }`}
                    >
                      {cat}
                    </button>

                    <ul className="mt-2 ml-4 space-y-1">
                      {researchData[cat].map((p, idx) => (
                        <li key={p.id}>
                          <Link
                            href={`/research?cat=${cat}&idx=${idx}`}
                            className={`block w-full text-left py-1 px-4 rounded text-sm transition ${
                              cat === selectedCategory && idx === selectedProjectIdx
                                ? "bg-primary/20 text-primary font-medium"
                                : "text-foreground/70 hover:bg-primary/10"
                            }`}
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* 본문 */}
              <div className="col-span-2 space-y-6">
                {project ? (
                  <div className="text-foreground">
                    {/* breadcrumb */}
                    <div className="text-sm text-muted-foreground mb-4">
                      <span>{selectedCategory}</span>
                      <span className="mx-2">/</span>
                      <span className="text-primary font-medium">{project.title}</span>
                    </div>

                    {/* 이미지 */}
                 
                  {project.imageUrl && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-4">
           <Image
            src={project.imageUrl.startsWith('/') ? project.imageUrl : project.imageUrl}
           alt={project.title}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
       
                 />
             </div>
              )}

                    {/* 프로젝트 타이틀 */}
                    <h2 className="text-2xl lg:text-3xl font-bold">
                      {project.title}
                    </h2>

                    {/* description */}
                    {project.description && (
                      <p className="text-muted-foreground mt-2">
                        {project.description}
                      </p>
                    )}

                    {/* contentHtml */}
                    {project.contentHtml && (
                      <div className="p-6 rounded-lg prose dark:prose-invert max-w-none mt-4">
                        <div dangerouslySetInnerHTML={{ __html: project.contentHtml }} />
                      </div>
                    )}

                    
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Select a project to see the details.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}