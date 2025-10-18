"use client";

import { useState } from "react";
import PeopleAdminEditor from "@/components/PeopleAdminEditor";

function AdminEditor() {
  const tabs = ["Main", "Research", "People", "News", "Contact"] as const;
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("People");

  return (
    <div className="w-full max-w-6xl bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-yellow-300">관리자 대시보드</h2>
        {/* 디자인 변경 필요하면 말씀해주세요 */}
      {/* 탭 버튼 */}
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

      {/* 탭에 따라 다른 에디터 보여주기 */}
      {selectedTab === "Main" && (
        <div className="text-white">🔧 Main 에디터 준비 중입니다.</div>
      )}
      {selectedTab === "Research" && (
        <div className="text-white">🔧 Research 에디터 준비 중입니다.</div>
      )}
       {selectedTab === "News" && (
        <div className="text-white">🔧 News 에디터 준비 중입니다.</div>
      )} {selectedTab === "Contact" && (
        <div className="text-white">🔧 Contact 에디터 준비 중입니다.</div> 
      )}
      {selectedTab === "People" && <PeopleAdminEditor />}
    </div>
  );
}
export default AdminEditor;