// app/research/ResearchClientPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

// This interface must match the data structure coming from the database
interface Project {
  id: string;
  title: string;
  description: string;
  // We'll need to adjust how subtitle and image are handled, as they are not in the DB schema.
  // For now, let's make them optional. We can add them to the schema later if needed.
  subtitle?: string; 
  image?: string;
}

interface ResearchData {
  Current: Project[];
  Completed: Project[];
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
    researchData["Current"][0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">Research</h1>
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
                        ? "bg-primary/20 text-primary font-semibold"
                        : "bg-primary/10 text-foreground/70 hover:bg-primary/20"
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

            <div className="space-y-6">
              {project ? (
                <>
                  <h2 className="text-2xl lg:text-3xl font-bold">
                    {project.title}
                  </h2>
                  {project.subtitle && (
                    <p className="text-lg text-foreground/70 italic">
                      {project.subtitle}
                    </p>
                  )}
                  <div className="bg-card/20 p-6 rounded-lg prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />
                  </div>
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full rounded-lg object-cover"
                    />
                  )}
                </>
              ) : (
                <p>Select a project to see the details.</p>
              )}
            </div>

            <div />
          </div>
        </div>
      </main>
    </div>
  );
}
