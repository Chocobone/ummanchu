'use client';

import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

function useRevealOnView(rootId?: string) {
  useEffect(() => {
    const rootEl = rootId ? document.getElementById(rootId) ?? undefined : undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            io.unobserve(el); // 한 번만 재생
          } else {
            // 스크롤로 벗어나면 다시 숨기고 싶으면 유지:
            el.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.1, root: rootEl } // 10% 보이면 실행
    );

    const toReveal = document.querySelectorAll<HTMLElement>(".reveal");
    toReveal.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootId]);
}

const CTASection = ({ researchData, newsData, homeContent, sliderImages }) => {
  const [current, setCurrent] = useState(0);
  useRevealOnView(); // 뷰포트에 들어올 때 애니메이션 재생

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
      <section className="relative h-screen w-full flex items-start text-foreground overflow-hidden pt-[120px]">
        {/* Background Image Slider */}
        {images.length > 0 && (
          <Image
            key={current}
            src={images[current]}
            alt={sliderImages[current]?.altText || `slide-${current}`}
            fill
            priority
            className="object-cover z-10 animate-kenburns brightness-[.65] contrast-110"
          />
        )}

        {/* 장식 이미지: 섹션 경계 내에서만 보이게 */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Image
            src="/main/HomepageMain.png"
            alt=""
            fill
            className="object-cover brightness-[.65] contrast-110"
            priority
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55 z-20 "></div>

        {/* Text Content  */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 text-left space-y-6">
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
          >
            {content.heroTitle || 'SSIL'}
            <br />
            <span className="text-white">
              {content.heroSubtitle || 'Space Science Instrument Laboratory'}
            </span>
          </h1>
        </div>




      </section>


      {/* About Section */}

      <section id="about" className="bg-background text-foreground py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="reveal from-left text-4xl font-bold mb-6">{content.aboutTitle || 'Empowering cosmic discovery—one payload at a time.'}</h2>
          <p className="reveal from-righttext-lg text-foreground-rgb/60">

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
      <ResearchSection researchData={researchData} />

      {/* News Section */}


      <section id="news" className="bg-background text-foreground-rgb py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">{content.newsTitle || 'NEWS'}</h2>
          <p className="mb-8 text-foreground-rgb/60">
            {content.newsSubtitle || 'Check out our latest news and announcements.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(newsData) && newsData.length > 0 ? (
              newsData.map((item) => (
                <div key={item.id} className="border border-border-rgb/20 rounded-lg overflow-hidden">
                  <div className="relative w-full h-48">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-foreground/10" />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>

                    <Link
                      href={`/news/${item.id}`}
                      className="text-brand font-semibold text-sm hover:text-brand-rgb/90"
                    >
                      READ MORE »
                    </Link>
                    <p className="text-xs mt-2 text-foreground-rgb/50">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-foreground-rgb/60">No news available.</p>
            )}
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

  useRevealOnView(); // 뷰포트에 들어올 때 애니메이션 재생

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
    <section id="research" className="bg-background text-foreground py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2">Our Mission</h2>
        <p className="mb-8 text-foreground-rgb/60">
          Recent highlights from SSIL’s research and missions.
        </p>
      </div>
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-lg">
        <div className="relative h-[500px] w-full">
          <Image src={current.imageUrl || "/images/main2.jpg"} alt={current.title} fill className="object-cover z-0" />
          <div className="absolute inset-0 bg-overlay-rgb/50 z-10" />
          <div className="absolute bottom-12 left-12 z-20 max-w-md">
            <Link href={`/research?cat=${category}&idx=${projectIndexInList}`}>
              <h2 className="reveal from-left text-brand text-3xl font-bold mb-2 cursor-pointer hover:underline">{current.title}</h2>
            </Link>
            {current.subtitle && (
              <Link href={`/research?cat=${category}&idx=${projectIndexInList}`}>
                <h3 className="reveal from-right text-xl text-foreground font-semibold italic mb-4 cursor-pointer hover:underline">{current.subtitle}</h3>
              </Link>
            )}
            <div className="reveal from-left text-foreground text-base prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: current.description }} />
          </div>
          <button onClick={prev} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-overlay-rgb/40 hover:bg-overlay-rgb/70 ">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-overlay-rgb/40 hover:bg-overlay-rgb/70 ">
            <ArrowRight className="w-6 h-6 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {allProjects.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? "bg-brand" : "bg-foreground-rgb/40"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;