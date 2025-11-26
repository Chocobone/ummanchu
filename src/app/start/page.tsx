"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      // 🔥 여기 API URL을 실제 url로 바꾸기 
      const res = await fetch("https://n8n.dpgtestbed.kr/webhook-test/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, pw }),
      });

      if (!res.ok) {
        setError("로그인 실패했습니다.");
        return;
      }

      // 🔥 성공하면 대시보드로 이동
      router.push("/generator");
    } catch (err) {
      console.error(err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[800px] p-20 border rounded-4xl ">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700"
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          className="w-full py-2 bg-purple-600 rounded hover:bg-purple-700"
          onClick={handleLogin}
        >
          로그인
        </button>
      </div>
    </div>
  );
}
