// app/people/page.tsx
"use client";

import Header from "@/components/Header";
import React, { useState } from "react";

// 공통 프로필 타입(비어 있으면 -- 표기)
type Profile = {
  name: string;
  position: string;
  description?: string;
  email?: string;
  phonenumber?: string;
  degree?: string;
  career?: string;
  image?: string;
};

// 예시 데이터
const peopleData: Record<"Professor" | "Current" | "Alumni", Profile[]> = {
  Professor: [
    {
      name: "Seon JongHo",
      position: "Professor",
      description: "Space Science Payload, Data Analysis",
      email: "jhseon@khu.ac.kr",
      degree:
        "학사 : 한국과학기술원 물리학과\n  석사 : Dept.of Physics and Astronomy, University of Iowa, Iowa City, USA\n  박사 : Dept.of Physics and Astronomy, University of Iowa, Iowa City, USA",
      career:
        "한국과학기술원 인공위성센터\n 현대전자 위성사업단\n 쎄트렉아이 우주기술연구소\n 한국과학기술원 물리학과 겸직교수\n UC Berkeley 우주과학연구소 객원 교수\n 한국우주과학회 학술이사/편집장",
      image: "/images/professor.png",
    },
  ],
  Current: [
    {
      name: "Go-Woon Na",
      position: "Research Professor",
      description: "Digital electronics, Particle detector, Space weather",
      image: "/images/current1.png",
      email: "gwna@khu.ac.kr",
      degree: "Ewha Womans University (2016)"
    },
    {
    name: "Beom-Su An",
    position: "Master Course",
    email:"bumsuan@khu.ac.kr",
    description:"Particle detector, Digital electronics, Space weather"

    },  
    {
    name: "Min-Hyuk Oh",
    position: "Master Course",
    email:"alsgur0108@khu.ac.kr",
    description:"Particle detector, Digital electronics, Space weather"

    },
    {
      name: "Kim Seung Jin",
      position: "Master Student",
      description: "Particle detector, Digital electronics, Space weather",
      email: "kimsungjin00@khu.ac.kr",
      phonenumber: " ",
      image: "/images/current2.png",
    },
  ],
  Alumni: [
    {
      name: "Lee MinSu",
      position: "Alumni",
      description: "졸업 후 진로 등",
      image: "/images/alumni1.png",
    },
  ],
};

export default function PeoplePage() {
  const tabs = ["Professor", "Current", "Alumni"] as const;
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>(
    tabs[0]
  );

  const profiles = peopleData[selectedTab];

  // 공백/미기재 시 "--"로 보이도록
  const F = (v?: string) => (v && v.trim() ? v.trim() : "--");

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
            <div className="col-span-2 space-y-10 overflow-y-auto">
              {profiles.map((profile, i) => (
                <section
                  key={i}
                  className="flex flex-col lg:flex-row items-start gap-6"
                >
                  {/* 이미지 */}
                  <div className="flex-shrink-0 self-center lg:self-start">
                    {/* 이미지 없으면 기본 플레이스홀더 */}
                    <img
                      src={profile.image || "/images/placeholder.png"}
                      alt={profile.name}
                      className="w-40 h-40 lg:w-48 lg:h-48 rounded-lg object-cover bg-muted"
                    />
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold">
                        {profile.name}
                      </h2>
                      <p className="text-foreground/70 italic">
                        {F(profile.position)}
                      </p>
                    </div>

                    {/* 상세 필드: Professor 기준 포맷 (다른 탭도 동일 포맷, 미기재는 --) */}
                    <div className="bg-card/30 rounded-lg p-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <dt className="text-sm text-foreground/60">Email</dt>
                          <dd className="font-medium">
                            {F(profile.email)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-foreground/60">Phone</dt>
                          <dd className="font-medium">
                            {F(profile.phonenumber)}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm text-foreground/60">Degree</dt>
                          <dd className="font-medium whitespace-pre-line">
                            {F(profile.degree)}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm text-foreground/60">Career</dt>
                          <dd className="font-medium whitespace-pre-line">
                            {F(profile.career)}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* 설명: 줄글로 아래 표시 */}
                    <div className="bg-card/20 p-4 rounded-lg">
                      <h3 className="text-sm text-foreground/60 mb-1">
                        Description
                      </h3>
                      <p className="leading-relaxed">
                        {F(profile.description)}
                      </p>
                    </div>
                  </div>
                </section>
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
