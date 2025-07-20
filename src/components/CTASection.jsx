"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";

const CTASection = () => {
  const images = [
    "/images/main1.jpg",
    "/images/main2.jpg",
    "/images/main3.jpg",
  ];
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
    <section className="py-24 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 left-32 w-12 h-12 border border-white/20 rounded-full" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Text Column */}
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

        {/* Image Column */}
        <div className="relative w-full h-96 overflow-hidden rounded-lg">
          <img
            src={images[current]}
            alt={`slide-${current}`}
            className="w-full h-full object-cover"
          />

          {/* Left Arrow */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
    
  );
};

export default CTASection;
