"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";

// 이미지 경로
const images = ["/images/main1.jpg", "/images/main2.jpg", "/images/main3.jpg"];

const CTASection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const prev = () =>
    setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () =>
    setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full" />
          <div className="absolute bottom-20 left-32 w-12 h-12 border border-white/20 rounded-full" />
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="lg:w-1/2 space-y-8 text-left">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              SSIL
              <br />
              <span className="text-yellow-300">
                Space Science Instrument Laboratory
              </span>
            </h2>
            <p className="text-xl opacity-90">
              From time immemorial, people have expressed a wide spectrum of
              interest in outer space—ranging from a vague longing to a passing
              curiosity. We now live in an age where space travel is no longer a
              distant dream. Yet despite—and indeed because of—these advances,
              there is a growing demand for a rigorous scientific understanding
              of cosmic phenomena, which in turn requires diverse observational
              data gathered from space. The Space Science Instrument Laboratory
              (SSIL) is dedicated to research precisely focused on meeting this
              need.
            </p>
          </div>

          {/* Image Slider */}
          <div className="relative w-full h-96 overflow-hidden rounded-lg">
            <img
              src={images[current]}
              alt={`slide-${current}`}
              className="w-full h-full object-cover"
            />
            <button onClick={prev} className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={next} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3">
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about"  className="bg-[#111111] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Empowering cosmic discovery—one payload at a time.</h2>
          <p className="text-lg text-gray-400">
            Since ancient times, people have expressed a variety of interests,
            ranging from vague admiration for the universe to a brief curiosity.
            Now, even space travel has reached a time when it is no longer an
            imagination. Despite these times, and also in these times, people need
            more scientific understanding of cosmic phenomena, which requires
            various kinds of observational data in outer space. The Space Science
            Instrument Laboratory (SSIL) focuses on this research.
          </p>
        </div>
      </section>

      {/* Research Section */}
      <section id="research"  className="bg-[#111111] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 space-y-4">
            <h3 className="font-semibold">Current</h3>
            <ul className="text-gray-400">
              <li className="text-white">LUSEM</li>
            </ul>
            <h3 className="font-semibold mt-8">Completed</h3>
            <ul className="text-gray-400 space-y-1">
              <li>CINEMA</li>
              <li>MEPD</li>
              <li>KSEM</li>
            </ul>
          </div>
          <div className="w-full lg:w-3/4 mt-10 lg:mt-0 lg:pl-12">
            <h2 className="text-3xl font-bold mb-2">LUSEM</h2>
            <p className="italic text-gray-400 mb-4">Lunar Space Environment Monitor</p>
            <p className="text-white mb-6">
              달 표면 및 지구에서 달까지 운반되는 고에너지 입자 관측 연구를 수행합니다.
            </p>
            <img src="/images/lusem.jpg" alt="LUSEM" className="h-40 object-contain" />
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="bg-[#181818] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">NEWS</h2>
          <p className="mb-8 text-gray-400">SSIL의 최신 소식과 공지사항을 확인하세요.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "SSIL, 차세대 우주장비 연구 착수",
                desc: "우주과학탐재체연구실(SSIL)이 새로운 우주장비 프로토타입 개발 프로젝트를 시작했습니다….",
                img: "/images/news1.jpg",
              },
              {
                title: "천문대 공개 관측 행사 안내",
                desc: "경희대 국제캠퍼스 천문대에서 8월 15일 공개 관측 행사를 엽니다. 누구나 무료로 참여 가능하며,…",
                img: "/images/news2.jpg",
              },
              {
                title: "우주탐사 X-프로젝트 중간 결과 발표",
                desc: "국제 우주탐사 X-프로젝트의 중간 보고서가 공개되었습니다. 주요 성과는 …",
                img: "/images/news3.jpg",
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{item.desc}</p>
                  <p className="text-yellow-400 font-semibold text-sm">READ MORE »</p>
                  <p className="text-xs mt-2 text-gray-500">Igen Soske · May 6, 2025</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact"  className="bg-[#0f0f0f] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
     
          <h2 className="text-3xl font-bold text-orange-400 mb-8">
            contact
          </h2>

          <div className="mb-6">
            <h3 className="text-orange-400 font-semibold">Labatory Name</h3>
            <p className="text-lg">우주과학탐재체연구실 (Space Science Instrument Laboratory)</p>
          </div>

          <div className="mb-6">
            <h3 className="text-orange-400 font-semibold">Labatory Location</h3>
            <p>
              (우)17104 경기도 용인시 기흥구 덕영대로 1732
              <br />
              경희대학교 국제캠퍼스 천문대 KyungHee University National Campus Observatory
            </p>
          </div>

       
        </div>
      </section>
    </>
  );
};

export default CTASection;