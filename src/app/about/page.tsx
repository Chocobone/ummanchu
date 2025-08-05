"use client";

import Header from "@/components/Header";
import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Mic, Video, TrendingUp, Briefcase } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 기존 "맞춤형 교재 & 커리큘럼" 헤더 */}
          <header className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold">
              About Us
            </h1>
            
            <p className="mt-4 text-xl text-foreground/70">
              
            </p>
          </header>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            {/* 왼쪽 칼럼: 강조 문구 + 본문 */}
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white">
                Empowering cosmic discovery—one payload at a time.
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Since ancient times, people have expressed a variety of interests, ranging from vague admiration
                for the universe to a brief curiosity. Now, even space travel has reached a time when it is no
                longer an imagination. Despite these times, and also in these times, people need more scientific
                understanding of cosmic phenomena, which requires various kinds of observational data in outer
                space. The Space Science Instrument Laboratory (SSIL) focuses on this research.
              </p>
            </div>
            
             <div>
              <img
                src="/images/professor.png"
                alt="SSIL Lab overview"
                className="w-full rounded-lg shadow-lg object-cover"
              />
               <p className="mt-2 text-sm text-center text-foreground/70">
                    Dr. JongHo Seon<br/>
                    
                     </p>
            </div>
          </div>

            {/* 🔶 여기에 주황색 배경 카드 추가 */}
        <div className="bg-orange-200 rounded-2xl p-8 mb-16">
           <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
            
           </h2>
          
           <p className="text-lg leading-relaxed text-black mb-6">
             Recently, the Space Science payload lab has been involved in the Commercial Lunar Payload Service (CLPS) project, one of NASA's Artemis missions in the U.S. The Lunar Space Environment Monitor (LUSEM), which is in development and is participating in this project, will observe charged particles not only on the surface of the moon but also on their way from Earth to the moon. So it is expected to provide information on the interactions between the Earth's magnetic field and the moon, which are still unknown areas, and observations on high-energy particles on the moon's surface. And the most recently completed payloads, the Korea Space Environment Monitor (KSEM) and the Medium Energy Particle Detector (MEPD), were mounted on Geo-KOMPSAT-2A and Next Generation Small Satellite-1, NEXTSat-1, respectively, and were launched into space at one-day intervals in December 2018. The geo-orbit complex, more famously named Chollian, is a satellite equipped with the weather forecasting system we are currently receiving. Each payload developed in the Space Science payload lab has been successfully carrying out its original mission so far since its launch.
           </p>
           <p className="text-lg leading-relaxed text-black">
            Most of the people who have been with us in the Space Science Embedded Laboratory continue to work in the space science industry. Some go abroad for more essential research, some go to the industry where you can feel the vivid scene of space science development, and live your own lives after each other's time together, but one thing is for sure: everyone is together with constant interest and goal in defying space science. I hope that life in the space science payload laboratory will serve as a springboard for those who worked together.

           </p>
         </div>
 <section className="prose prose-invert max-w-none">



 </section>

          {/* ↓ 이 아래로 있던 카드 그리드, 커스텀 커리큘럼 섹션 등 모두 지우고… ↓ */}

          {/* — 여기에 원하시는 줄글(단락) 내용을 넣어주세요 — */}
          {/* 예시)

          
              <section className="prose prose-invert max-w-none">
                <p>첫 번째 단락 내용…</p>
                <p>두 번째 단락 내용…</p>
                … 
              </section>
          */}

   <section className="prose prose-invert max-w-none">
          {/* (기존에 prose 섹션을 쓰실 거면 여기에 내용) */}
        </section>

        {/* — 단체사진 넣는 곳 시작 — */}
        <div className="mt-16">
          <img
            src="/images/group-photo.jpg"
            alt="SSIL 팀 단체사진"
            className="w-full rounded-lg object-cover shadow-lg"
          />
        </div>
        {/* — 단체사진 넣는 곳 끝 — */}
        </div>
      </main>
    </div>
  );
}