"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight,ArrowLeft, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
const CTASection = () => {
  // Main 페이지에서 사용하게 될 이미지들 
  const images = [
    "/images/main1.jpg",
    "/images/main2.jpg",
    "images/main3.jpg"
  ];
  // 슬라이드로 넘어가면서 그림을 보여주기 위해서 
  const [current,setCurrent] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c+1) % images.length);
    },5000);
    return () => clearInterval(id);
  } , []);
  const prev = () =>
  setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  return (
    <section className="py-24 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full"></div>
      </div>
    
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-8 text-left">
          <div className="flex justify-start space-x-1">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            SSIL 
            <br />
            <span className="text-yellow-300">Space Science Instrument Labatory </span>          </h2>
          
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
           From time immemorial, people have expressed a wide spectrum of interest in outer space—ranging from a vague longing to a passing curiosity. We now live in an age where space travel is no longer a distant dream. Yet despite—and indeed because of—these advances, there is a growing demand for a rigorous scientific understanding of cosmic phenomena, which in turn requires diverse observational data gathered from space. The Space Science Instrument Laboratory (SSIL) is dedicated to research precisely focused on meeting this need.
          </p>
       
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
          
          </div>
           
           
          </div>

      <div className="lg:2-1/2 relative">
      <img 
      src={images[current]}
      alt={'slide-${current}'}
      className="w-full h-auto object-cover rounded-lg"
      />
      <button onClick={prev}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 p-2 rounded-full"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <button
        onClick={next}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg bg-opacity-50 p-2 rounded-full">
        <ArrowRight className="w-5 h-5 texth-white" />
        </button>

        </div>







        </div>
    
    </section>
  );
};

export default CTASection;