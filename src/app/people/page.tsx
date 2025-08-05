// app/people/page.tsx
"use client";

import Header from "@/components/Header";
import React, { useState } from "react";

// 예시 데이터 (실제 프로필 데이터로 교체하세요)
const peopleData = {
  Professor: [
    {
      name: "Seon JongHo",
      position: "Professor",
      description: "연구 주제 나열",
      image: "/images/professor.png",
    },
  ],
  Current: [
    {
      name: "Kim YoungHee",
      position: "PhD Student",
      description: "머하는지 등",
      image: "/images/current1.png",
    },
    {
      name: "Kim Seung Jin",
      position: "Master Student",
      description: "Coding",
      image: "/images/current2.png",
    },
    // …추가 현직 연구원…
  ],
  Alumni: [
    {
      name: "Lee MinSu",
      position: "Alumni",
      description: "졸업 후 진로 등",
      image: "/images/alumni1.png",
    },
    // …추가 동문…
  ],
};

export default function PeoplePage() {
  const tabs = ["Professor", "Current", "Alumni"] as const;
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]>(
    tabs[0]
  );

  const profiles = peopleData[selectedTab];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">People</h1>
          </header>

          {/* 4-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 1) Sidebar nav */}
            <nav className="space-y-4 col-span-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTab(t)}
                  className={`w-full text-left py-2 px-4 rounded transition ${
                    selectedTab === t
                      ? "bg-primary/20 text-primary font-semibold"
                      : "bg-primary/10 text-foreground/70 hover:bg-primary/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>

            {/* 2) 중앙 칸: profiles 리스트 (col-span-2) */}
            <div className="col-span-2 space-y-8 overflow-y-auto">
              {profiles.map((profile, i) => (
                <div
                  key={i}
                  className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8"
                >
                  {/* 텍스트 블록 */}
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                      {profile.name}
                    </h2>
                    <p className="text-foreground/70 italic mb-4">
                      {profile.position}
                    </p>
                    <div className="bg-card/20 p-6 rounded-lg">
                      <p>{profile.description}</p>
                    </div>
                  </div>
                  {/* 이미지 블록 */}
                  <div className="flex-shrink-0">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-48 h-48 rounded-lg object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 3) 우측 여유 공간 */}
            <div className="col-span-1" />
          </div>
        </div>
      </main>
    </div>
  );
}
