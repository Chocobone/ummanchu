"use client";

import { useState } from "react";

export default function ResultPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const musicList = [
    { id: 1, title: "AI 추천", length: "01:30" },
    { id: 2, title: "Vibe #2", length: "01:25" },
    { id: 3, title: "Vibe #3", length: "01:40" },
  ];

  return (
    <div className="px-4 max-w-5xl mx-auto py-16">
      <h2 className="text-3xl font-bold mb-8">생성된 음악을 선택하세요</h2>

      {/* 업로드된 영상 미리보기 */}
      <div className="flex gap-6 mb-10">
        <div className="w-64 h-40 rounded-lg bg-gradient-to-br from-purple-300 to-indigo-400" />
      </div>

      {/* 음악 리스트 */}
      <div className="space-y-6">
        {musicList.map((m, index) => (
          <div
            key={m.id}
            className={`border rounded-xl p-6 cursor-pointer transition ${
              selected === index
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                : "border-gray-700"
            }`}
            onClick={() => setSelected(index)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">음악 옵션 {m.id}</h3>
                <p className="text-sm text-gray-400">{m.title}</p>
              </div>

              <span className="text-gray-300">{m.length}</span>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="px-4 py-2 bg-gray-700 rounded-lg">▶</button>
              <button className="px-4 py-2 bg-gray-700 rounded-lg">⬇ 다운로드</button>
              <button
                className={`flex-1 py-2 rounded-lg ${
                  selected === index
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800"
                }`}
              >
                {selected === index ? "이 음악으로 선택됨" : "선택하기"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
