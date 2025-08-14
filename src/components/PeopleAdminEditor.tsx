"use client";

import React, { useState } from "react";

type Profile = {
  name: string;
  position: string;
  description?: string;
  email?: string;
  phonenumber?: string;
  degree?: string;
  career?: string;
  image?: string;
};

const initialPeople: Record<"Professor" | "Current" | "Alumni", Profile[]> = {
  Professor: [],
  Current: [],
  Alumni: [],
};

export default function PeopleAdminEditor() {
  const tabs = ["Professor", "Current", "Alumni"] as const;
  const [people, setPeople] = useState(initialPeople);
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("Professor");

  const handleAdd = () => {
    const newPerson: Profile = {
      name: "",
      position: "",
      email: "",
      phonenumber: "",
      degree: "",
      career: "",
      description: "",
      image: "",
    };
    setPeople((prev) => ({
      ...prev,
      [selectedTab]: [...prev[selectedTab], newPerson],
    }));
  };

  const handleDelete = (index: number) => {
    setPeople((prev) => ({
      ...prev,
      [selectedTab]: prev[selectedTab].filter((_, i) => i !== index),
    }));
  };

  const handleChange = (index: number, field: keyof Profile, value: string) => {
    const updated = [...people[selectedTab]];
    updated[index] = { ...updated[index], [field]: value };
    setPeople((prev) => ({
      ...prev,
      [selectedTab]: updated,
    }));
  };

  const handleSave = async () => {
    try {
      await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(people),
      });
      alert("저장 완료!");
    } catch (e) {
      alert("저장 실패");
    }
  };

  return (
    <div className="w-full max-w-5xl bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-300">🛠 People 관리 페이지</h2>

      {/* 탭 선택 */}
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded ${
              selectedTab === tab
                ? "bg-yellow-400 text-black font-bold"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 프로필 리스트 */}
      <div className="space-y-6">
        {people[selectedTab].map((profile, i) => (
          <div key={i} className="bg-black border border-gray-600 rounded p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="bg-gray-900 text-white p-2 rounded"
                placeholder="이름"
                value={profile.name}
                onChange={(e) => handleChange(i, "name", e.target.value)}
              />
              <input
                className="bg-gray-900 text-white p-2 rounded"
                placeholder="직책"
                value={profile.position}
                onChange={(e) => handleChange(i, "position", e.target.value)}
              />
              <input
                className="bg-gray-900 text-white p-2 rounded"
                placeholder="이메일"
                value={profile.email || ""}
                onChange={(e) => handleChange(i, "email", e.target.value)}
              />
              <input
                className="bg-gray-900 text-white p-2 rounded"
                placeholder="전화번호"
                value={profile.phonenumber || ""}
                onChange={(e) => handleChange(i, "phonenumber", e.target.value)}
              />
              <input
                className="bg-gray-900 text-white p-2 rounded"
                placeholder="이미지 경로"
                value={profile.image || ""}
                onChange={(e) => handleChange(i, "image", e.target.value)}
              />
            </div>
            <textarea
              className="w-full bg-gray-900 text-white p-2 rounded"
              placeholder="학위"
              rows={2}
              value={profile.degree || ""}
              onChange={(e) => handleChange(i, "degree", e.target.value)}
            />
            <textarea
              className="w-full bg-gray-900 text-white p-2 rounded"
              placeholder="경력"
              rows={2}
              value={profile.career || ""}
              onChange={(e) => handleChange(i, "career", e.target.value)}
            />
            <textarea
              className="w-full bg-gray-900 text-white p-2 rounded"
              placeholder="설명"
              rows={2}
              value={profile.description || ""}
              onChange={(e) => handleChange(i, "description", e.target.value)}
            />

            <button
              className="bg-red-600 text-white px-3 py-1 mt-2 rounded hover:bg-red-500"
              onClick={() => handleDelete(i)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 추가 및 저장 버튼 */}
      <div className="mt-8 flex justify-between">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-400"
          onClick={handleAdd}
        >
          + 인물 추가
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-400"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}
