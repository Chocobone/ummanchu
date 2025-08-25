'use client';

import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const CTASection = ({ researchData, newsData, homeContent, sliderImages }) => {
  const [current, setCurrent] = useState(0);
  
  const images = sliderImages?.map(img => img.imageUrl) || [];

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % (images.length || 1));
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [images.length, next]);

  const prev = (e) => {
    e.stopPropagation();
    setCurrent(c => (c - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    next();
  }

  const content = homeContent || {};

  return (
    <>
      {/* Hero Section - Left Aligned */}
      <section className="relative h-screen w-full flex items-center text-white overflow-hidden">
        {/* Background Image Slider */}
        {images.length > 0 && (
          <Image
            key={current}
            src={images[current]}
            alt={sliderImages[current]?.altText || `slide-${current}`}
            fill
            priority
            className="object-cover z-10 animate-kenburns"
          />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-20"></div>

        {/* Text Content */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 text-left space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            {content.heroTitle || 'SSIL'}
            <br />
            <span className="text-yellow-400">
              {content.heroSubtitle || 'Space Science Instrument Laboratory'}
            </span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
            {content.heroParagraph || 'From time immemorial, people have expressed a wide spectrum of interest in outer space... The Space Science Instrument Laboratory (SSIL) is dedicated to research precisely focused on meeting this need.'}
          </p>
        </div>

        {/* Slider Controls */}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm">
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </section>

      {/* About Section */}
      <section id="about"  className="bg-[#111111] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{content.aboutTitle || 'Empowering cosmic discovery—one payload at a time.'}</h2>
          <p className="text-lg text-gray-400">
            {content.aboutParagraph || 'Since ancient times, people have expressed a variety of interests...'}
          </p>
        </div>
      </section>

      {/* Research Section */}
      <ResearchSection researchData={researchData} /> 

      {/* News Section */}
      <section id="news" className="bg-[#181818] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">{content.newsTitle || 'NEWS'}</h2>
          <p className="mb-8 text-gray-400">{content.newsSubtitle || 'SSIL의 최신 소식과 공지사항을 확인하세요.'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsData && newsData.length > 0 ? (
              newsData.map((item) => (
                <div key={item.id} className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image src={item.imageUrl || "/images/news_placeholder.jpg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <div className="text-sm text-gray-300 mb-2 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />
                    <Link href={`/news/${item.id}`} className="text-yellow-400 font-semibold text-sm">READ MORE »</Link>
                    <p className="text-xs mt-2 text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400">No news available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section (Unchanged) */}
      <section id="contact"  className="bg-[#0f0f0f] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Contact</h2>
          <div className="mb-6">
            <h3 className="text-yellow-400 font-semibold">Labatory Name</h3>
            <p className="text-lg">우주과학탐재체연구실 (Space Science Instrument Laboratory)</p>
          </div>
          <div className="mb-6">
            <h3 className="text-yellow-400 font-semibold">Labatory Location</h3>
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

const ResearchSection = ({ researchData }) => {
  const [index, setIndex] = useState(0);
  const allProjects = researchData ? [...researchData.Current, ...researchData.Completed] : [];
  const total = allProjects.length;

  const next = useCallback(() => {
    if (total === 0) return;
    setIndex((prevIndex) => (prevIndex + 1) % total);
  }, [total]);

  const prev = () => {
    if (total === 0) return;
    setIndex((prevIndex) => (prevIndex - 1 + total) % total);
  };

  useEffect(() => {
    if (total === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [total, next]);

  if (total === 0) {
    return null;
  }

  const current = allProjects[index];
  const category = current.status === 'IN_PROGRESS' ? 'Current' : 'Completed';
  const projectIndexInList = researchData[category].findIndex(p => p.id === current.id);

  return (
    <section id="research" className="bg-[#111111] text-white py-24 px-4">
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-lg">
        <div className="relative h-[500px] w-full">
          <Image src={current.imageUrl || "/images/main2.jpg"} alt={current.title} fill className="object-cover z-0" />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute bottom-12 left-12 z-20 max-w-md">
            <Link href={`/research?cat=${category}&idx=${projectIndexInList}`}>
              <h2 className="text-yellow-400 text-3xl font-bold mb-2 cursor-pointer hover:underline">{current.title}</h2>
            </Link>
            {current.subtitle && (
              <Link href={`/research?cat=${category}&idx=${projectIndexInList}`}>
                <h3 className="text-xl text-white font-semibold italic mb-4 cursor-pointer hover:underline">{current.subtitle}</h3>
              </Link>
            )}
            <div className="text-white text-base prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: current.description }} />
          </div>
          <button onClick={prev} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70 rounded-full">
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {allProjects.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? "bg-yellow-400" : "bg-gray-400/50"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;