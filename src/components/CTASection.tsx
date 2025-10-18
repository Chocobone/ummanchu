"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

const CTASection = ({ researchData, newsData, homeContent, sliderImages }) => {
  const [scrollY, setScrollY] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroTranslate = Math.min(scrollY / 1.5, 300);
  const heroOpacity = Math.max(1 - scrollY / 300, 0);
  const heroScale = Math.max(1 - scrollY / 800, 0.85);

  const images = sliderImages?.map((img) => img.imageUrl) || [];
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % (images.length || 1));
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [images.length, next]);

  const content = homeContent || {};

  return (
    <>
      <section className="relative h-screen w-full flex items-start text-foreground overflow-hidden pt-[120px]">
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

        <div className="absolute inset-0 z-10 pointer-events-none">
          <Image
            src="/main/HomepageMain.png"
            alt=""
            fill
            className="object-cover brightness-[.65] contrast-110"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/55 z-20" />

        <div className="relative z-30 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 text-center space-y-6">
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            style={{
              transform: `translateY(${heroTranslate}px) scale(${heroScale})`,
              opacity: heroOpacity,
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              transition: "transform 0.1s linear, opacity 0.1s linear",
            }}
          >
            <span className="text-primary">
              {content.heroTitle || "SSIL"}
            </span>
            <br />
            <span className="text-white">
              {content.heroSubtitle ||
                "Space Science Instrument Laboratory"}
            </span>
          </h1>
        </div>
      </section>

      <AboutSection content={content} />
      <ResearchSection researchData={researchData} />

      <section id="news" className="bg-background text-foreground py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">
            {content.newsTitle || "NEWS"}
          </h2>
          <p className="mb-8 text-foreground/70">
            {content.newsSubtitle ||
              "Check out our latest news and announcements."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(newsData) && newsData.length > 0 ? (
              newsData.map((item) => (
                <div
                  key={item.id}
                  className="border border-border/20 rounded-lg overflow-hidden"
                >
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
                      className="text-primary font-semibold text-sm hover:text-primary/80"
                    >
                      READ MORE »
                    </Link>
                    <p className="text-xs mt-2 text-foreground/50">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-foreground/60">
                No news available.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const AboutSection = ({ content }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center 60%"],
  });

  const h2X = useTransform(scrollYProgress, [0, 1], ["-120px", "0px"]);
  const h2Opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pX = useTransform(scrollYProgress, [0, 1], ["120px", "0px"]);
  const pOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      id="about"
      className="bg-background text-foreground py-40 px-6 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          style={{
            x: h2X,
            opacity: h2Opacity,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
          }}
        >
          {content.aboutTitle ||
            "Empowering cosmic discovery—one payload at a time."}
        </motion.h2>
        <motion.p
          className="text-lg text-foreground/70 max-w-3xl mx-auto"
          style={{
            x: pX,
            opacity: pOpacity,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 25,
            delay: 0.05,
          }}
        >
          Since ancient times, people have expressed a variety of interests,
          ranging from vague admiration for the universe to a brief curiosity.
          Now, even space travel has reached a time when it is no longer an
          imagination. Despite these times, and also in these times, people need
          more scientific understanding of cosmic phenomena, which requires
          various kinds of observational data in outer space. The Space Science
          Instrument Laboratory (SSIL) focuses on this research.
        </motion.p>
      </div>
    </section>
  );
};

const ResearchSection = ({ researchData }) => {
  const [index, setIndex] = useState(0);
  const allProjects = researchData
    ? [...researchData.Current, ...researchData.Completed]
    : [];
  const total = allProjects.length;

  const next = useCallback(() => {
    if (total === 0) return;
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [total, next]);

  if (total === 0) return null;

  const current = allProjects[index];
  const category = current.status === "IN_PROGRESS" ? "Current" : "Completed";
  const projectIndexInList = researchData[category].findIndex(
    (p) => p.id === current.id
  );

  return (
    <section id="research" className="bg-background text-foreground py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2">Our Mission</h2>
        <p className="mb-8 text-foreground/70">
          Recent highlights from SSIL’s research and missions.
        </p>
      </div>
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-lg">
        <div className="relative h-[500px] w-full">
          <Image
            src={current.imageUrl || "/images/main2.jpg"}
            alt={current.title}
            fill
            className="object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute bottom-12 left-12 z-20 max-w-md">
            <Link href={`/research?cat=${category}&idx=${projectIndexInList}`}>
              <h2 className="text-primary text-3xl font-bold mb-2 cursor-pointer hover:underline">
                {current.title}
              </h2>
            </Link>
            {current.subtitle && (
              <Link href={`/research?cat=${category}&idx=${projectIndexInList}`}>
                <h3 className="text-xl text-foreground font-semibold italic mb-4 cursor-pointer hover:underline">
                  {current.subtitle}
                </h3>
              </Link>
            )}
            <div
              className="text-foreground text-base prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: current.description }}
            />
          </div>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70"
          >
            <ArrowRight className="w-6 h-6 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {allProjects.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-primary" : "bg-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
