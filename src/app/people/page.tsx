// app/people/page.tsx
"use client";

import Header from "@/components/Header";
import React, { useState } from "react";

// 예시 데이터: 실제로는 각 배열 안에 여러 프로필 객체를 채워주세요
const peopleData = {
  Professor: [
    {
      name: "Seon JongHo",
      position: "Professor",
      description: "연구 주제 나열",
      image: "/images/professor.png",
    },
    // ...다른 교수님들
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
        position: "master student",
        description: "coding",
        image: "images/current2.png"

    }

    // ...다른 현직 연구원들
  ],
  Alumni: [
    {
      name: "Lee MinSu",
      position: "Alumni",
      description: "졸업 후 진로 머할지",
      image: "/images/alumni1.png",
    },
    // ...다른 동문들
  ],
};

export default function PeoplePage() {
  // 1) 현재 선택된 탭을 state 로 관리
  const tabs = ["Professor", "Current", "Alumni"] as const;
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]>(
    tabs[0]
  );

  // 2) 선택된 탭의 첫 번째 프로필 가져오기
  const profile = peopleData[selectedTab][0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">People</h1>
          </header>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1) Sidebar nav: 클릭할 때마다 selectedTab 변경 */}
            <nav className="space-y-4">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTab(t)}
                  className={`w-full text-left py-2 px-4 rounded transition 
                    ${
                      selectedTab === t
                        ? "bg-primary/20 text-primary font-semibold"
                        : "bg-primary/10 text-foreground/70 hover:bg-primary/20"
                    }`}
                >
                  {t}
                </button>
              ))}
            </nav>

            {/* 2) 중앙 칸: 선택된 탭(selectedTab)의 첫 번째 profile만 렌더링 */}
            <div className="space-y-6 flex flex-col lg:flex-row lg:items-start lg:space-x-8">
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
              <div className="flex justify-center lg:justify-start">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-48 h-48 rounded-lg object-cover"
                />
              </div>
            </div>

            {/* 3) 빈 칸 */}
            <div />
          </div>
        </div>
      </main>
    </div>
  );
}
