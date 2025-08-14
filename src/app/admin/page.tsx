"use client";

import { useState } from "react";
import PeopleAdminEditor from "@/components/PeopleAdminEditor";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      setLoginFailed(false);
    } else {
      setIsLoggedIn(false);
      setLoginFailed(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10 flex items-center justify-center">
      {!isLoggedIn ? (
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">🔒 Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-400">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="••••••"
              />
            </div>

            {loginFailed && (
              <p className="text-red-500 text-sm">❗ 로그인에 실패했습니다.</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition"
            >
              로그인
            </button>
          </div>
        </div>
      ) : (
        <AdminEditor />
      )}
    </main>
  );
}

//  로그인 성공 시 보여줄 관리자 기능 페이지 컴포넌트
function AdminEditor() {
  return (
    <div className="w-full max-w-3xl bg-[#1a1a1a] p-10 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-300"> 로그인 성공</h2>
      <p className="mb-6 text-gray-300">
        안녕하세요 관리자님!
      </p>

      <div className="space-y-4">
        <label className="block text-sm text-gray-400">페이지 제목 수정</label>
        <input
          type="text"
          defaultValue="기존 제목"
          className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none"
        />

        <label className="block text-sm text-gray-400">본문 내용 수정</label>
        <textarea
          defaultValue="기존 본문 내용입니다..."
          className="w-full h-40 px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none"
        />

        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          저장하기
        </button>
      </div>
    </div>
  );
}