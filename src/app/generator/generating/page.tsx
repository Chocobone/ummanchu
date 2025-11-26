"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GeneratingPage() {
 const router = useRouter();
  const params = useSearchParams();
  const taskId = params.get("task_id"); // ← 여기서 task_id 가져옴

 useEffect(() => {
  if (!taskId) return;

  const interval = setInterval(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${taskId}`);
    const data = await res.json();

    console.log("현재 상태:", data.status);

    // 1) 음악 생성이 끝났으면 → results로 이동
    if (data.status === "music_ready") {
      clearInterval(interval);
      router.push(`/generator/results?task_id=${taskId}`);
    }

    // 2) 처리 중 (processing, analyzing_video, generating_music) → 계속 대기
    // 아무것도 안 해도 됨

    // 3) 실패한 경우
    if (data.status === "failed") {
      clearInterval(interval);
      alert("음악 생성 실패!");
      router.push("/generator");
    }
  }, 2000);

  return () => clearInterval(interval);
}, [taskId]);


  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6" />

      <h2 className="text-3xl font-bold mb-3">음악을 생성하고 있습니다</h2>
      <p className="text-gray-400 mb-10">
        영상 분석 및 배경 음악 생성 중입니다. 잠시만 기다려 주세요.
      </p>

      <button
        className="mt-10 px-6 py-3 rounded-lg border border-purple-500 text-purple-600"
        onClick={() => router.push("/generator")}
      >
        Cancel
      </button>
    </div>
  );
}