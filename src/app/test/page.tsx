// src/app/write/page.tsx
"use client";
// 추가하기
import React, { useState } from "react";
import Header from "@/components/Header";
import RichEditor from "@/components/RichEditor";

export default function WritePostPage() {
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: contentHtml }),
    });
    alert("저장 완료!");
  };

  return (
    <div className="min-h-screen bg-background/10">
      <Header />
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <RichEditor initialValue={contentHtml} onChange={setContentHtml} />

        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
        >
          글 등록하기
        </button>
      </main>
    </div>
  );
}
