// app/research/page.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/Header";

interface Project {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
}

const researchData: Record<string, Project[]> = {
  Current: [
    {
      title: "LUSEM",
      subtitle: "Lunar Space Environment Monitor",
      description:
        "달 표면 및 지구에서 달까지 운반되는 고에너지 입자 관측 연구를 수행합니다.",
      image: "/images/professor.png",
    },
  ],
  Completed: [
    {
      title: "CINEMA",
      subtitle: "CubeSat for Ionospheric Neutron and Electron Monitoring",
      description:
        "이온층 중성자 및 전자를 관측하는 CubeSat 기반 미션으로, 우주환경 변화를 탐구했습니다.",
      image: "/images/cinema.png",
    },
    {
      title: "MEPD",
      subtitle: "Medium Energy Particle Detector",
      description:
        "지오-컴프샛‑2A에 탑재된 중에너지 입자 검출기로, 지자기권 입자 분포를 분석했습니다.",
      image: "/images/mepd.png",
    },
    {
      title: "KSEM",
      subtitle: "Korea Space Environment Monitor",
      description:
        "NEXTSat‑1에 탑재되어 한국형 우주 환경 모니터링을 수행하는 핵심 장비입니다.",
      image: "/images/ksem.png",
    },
  ],
};

export default function ResearchPage() {
  const categories = Object.keys(researchData);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);

  const project = researchData[selectedCategory][selectedProjectIdx];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">Research</h1>
          </header>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1) Sidebar nav: categories + always-visible project lists */}
            <nav className="space-y-6">
              {categories.map((cat) => (
                <div key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedProjectIdx(0);
                    }}
                    className={`block w-full text-left py-2 px-4 rounded transition
                      ${
                        selectedCategory === cat
                          ? "bg-primary/20 text-primary font-semibold"
                          : "bg-primary/10 text-foreground/70 hover:bg-primary/20"
                      }`}
                  >
                    {cat}
                  </button>

                  {/* always show the project list */}
                  <ul className="mt-2 ml-4 space-y-1">
                    {researchData[cat].map((p, idx) => (
                      <li key={p.title}>
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSelectedProjectIdx(idx);
                          }}
                          className={`block w-full text-left py-1 px-4 rounded text-sm transition
                            ${
                              cat === selectedCategory && idx === selectedProjectIdx
                                ? "bg-primary/20 text-primary font-medium"
                                : "text-foreground/70 hover:bg-primary/10"
                            }`}
                        >
                          {p.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* 2) Project Detail */}
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold">{project.title}</h2>
              {project.subtitle && (
                <p className="text-lg text-foreground/70 italic">
                  {project.subtitle}
                </p>
              )}
              <div className="bg-card/20 p-6 rounded-lg">
                <p>{project.description}</p>
              </div>
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full rounded-lg object-cover"
                />
              )}
            </div>

            {/* 3) Spacer */}
            <div />
          </div>
        </div>
      </main>
    </div>
  );
}
