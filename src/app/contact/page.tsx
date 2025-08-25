// app/contact/page.tsx
"use client";

import React from "react";
import Header from "@/components/Header";

const ContactPage: React.FC = () => {
  return (
    <>
    {/* 공통 헤더 */}
      <Header />
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      

      {/* 페이지 콘텐츠 */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* 제목 (파란색) */}
          <h1 className="text-5xl font-bold text-center">
            SSIL Contact
          </h1>

          {/* 정보 */}
          <div className="space-y-6">
            <div>
              {/* 소제목 (주황색) */}
              <h2 className="text-xl font-semibold text-yellow-400">
                Labatory Name
              </h2>
              <p className="mt-1 text-lg">
                우주과학탑재체연구실 (Space Science Instrument Laboratory)
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">
                Labatory Location
              </h2>
              <p className="mt-1 text-lg leading-relaxed">
                (우)17104 경기도 용인시 기흥구 덕영대로 1732<br />
                경희대학교 국제캠퍼스 천문대
                KyungHee University National Campus Observatory
              </p>
            </div>
          </div>

          {/* 지도 */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=경희천문대(KHAO)&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ContactPage;
