"use client";

import { useEffect, useState } from "react";

export default function GeneratingPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // 서버에서 생성된 음악 파일 존재 확인 (HEAD로 가볍게 체크)
        const res = await fetch("http://49.50.139.233:8000/output/music1.mp3", {
          method: "HEAD",
          cache: "no-cache",
        });

        if (res.ok) {
          console.log("파일 생성됨!");
          clearInterval(interval);
          window.location.href = "/generator/results";
        }
      } catch (e) {
        console.log("아직 파일 없음");
      }
    }, 3000); // 3초마다 체크

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6" />

      <h2 className="text-3xl font-bold mb-3">음악을 생성하고 있습니다</h2>
      <p className="text-gray-400 mb-10">
        영상 분석 및 배경 음악 생성 중입니다. 잠시만 기다려 주세요.
      </p>

      <button className="mt-10 px-6 py-3 bg-gray-700 rounded-lg">
        Cancel
      </button>
    </div>
  );
}
