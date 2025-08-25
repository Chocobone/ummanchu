// app/research/ResearchClientPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { Research } from '@prisma/client'; // Import the correct type from Prisma

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
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number>(
    isNaN(idxParam) ? 0 : idxParam
  );

  // Sync state with URL params
  useEffect(() => {
    if (categories.includes(catParam)) {
      setSelectedCategory(catParam);
    }
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
            <header className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white">Research</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                          ? "bg-yellow-400/20 text-yellow-400 font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
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
                              cat === selectedCategory &&
                              idx === selectedProjectIdx
                                ? "bg-yellow-400/20 text-yellow-400 font-medium"
                                : "text-white/70 hover:bg-yellow-400/10"
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

              <div className="col-span-2 space-y-6">
                {project ? (
                  <div className="text-white">
                    <h2 className="text-2xl lg:text-3xl font-bold">
                      {project.title}
                    </h2>
                    {project.subtitle && (
                      <p className="text-lg text-white/70 italic mt-1">
                        {project.subtitle}
                      </p>
                    )}
                    <div className="bg-card/20 p-6 rounded-lg prose dark:prose-invert max-w-none mt-4">
                      <div dangerouslySetInnerHTML={{ __html: project.description }} />
                    </div>
                    {project.imageUrl && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-4">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-white/70">Select a project to see the details.</p>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
