"use client";

import { useEffect, useState } from "react";

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const timer = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          window.location.href = "/generator/results";
        }, 500); // 로딩 끝나고 결과 페이지로 이동
      }
    }, 100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6" />

      <h2 className="text-3xl font-bold mb-3">음악을 생성하고 있습니다</h2>
      <p className="text-gray-400 mb-10">
        영상을 분석하고 배경 음악을 만들고 있어요. 잠시만 기다려 주세요.
      </p>

      <div className="w-full max-w-md mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span>영상 분석 중…</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded-full">
          <div
            className="h-2 bg-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 mt-3">완료까지 약 3분 남았습니다</p>
      </div>

      <button className="mt-10 px-6 py-3 bg-gray-700 rounded-lg">
        Cancel
      </button>
    </div>
  );
}
