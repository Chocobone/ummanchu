"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from 'wavesurfer.js/plugins/regions';

export default function WaveTestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 시간 포맷 함수
  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // WaveSurfer 생성
    waveRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(147, 51, 234, 0.4)", // 보라
      progressColor: "rgba(147, 51, 234, 1)",
      cursorColor: "#fff",
      height: 100,
      barWidth: 1,
      barGap: 1,
      barRadius: 2,
       dragToSeek: true,
      minPxPerSec: 200,
      normalize: false,
      url: "/audio/music2.mp3",
 

   });

    // 전체 duration 셋팅
    waveRef.current.on("ready", () => {
      setDuration(waveRef.current!.getDuration());
    });

    // 재생 위치 시간 업데이트
    waveRef.current.on("audioprocess", () => {
      setCurrentTime(waveRef.current!.getCurrentTime());
    });

   // 재생 중 시간 업데이트
waveRef.current.on("audioprocess", () => {
  setCurrentTime(waveRef.current!.getCurrentTime());
});

// 사용자가 파형을 클릭해서 이동할 때
waveRef.current.on("interaction", () => {
  setCurrentTime(waveRef.current!.getCurrentTime());
});

    return () => {
      waveRef.current?.destroy();
    };
  }, []);

  const play = () => {
    waveRef.current?.playPause();
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-4">

      <h1 className="text-4xl font-extrabold mb-10">
        WaveSurfer 테스트 페이지
      </h1>

      <div
        className="
          w-full max-w-3xl 
          bg-gradient-to-br from-neutral-800 to-neutral-900 
          rounded-2xl shadow-xl p-8
          border border-neutral-700
        "
      >
        {/* 재생 시간 표시 */}
        <div className="flex justify-between text-sm text-gray-300 mb-2 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div
          ref={containerRef}
          className="
            w-full h-[120px] rounded-lg 
            bg-neutral-700/30 backdrop-blur-md
            border border-neutral-600
          "
        />

        <button
          onClick={play}
          className="
            mt-8 w-full py-4 rounded-xl 
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:opacity-90 transition text-white font-semibold text-lg
            shadow-lg
          "
        >
          ▶ 재생 / 일시정지
        </button>
      </div>
    </div>
  );
}
