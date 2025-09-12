import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-400 mb-8">Contact</h2>

        <div className="mb-6">
          <h3 className="text-orange-400 font-semibold">Labatory Name</h3>
          <p className="text-lg">우주과학탐재체연구실 (Space Science Instrument Laboratory)</p>
        </div>

        <div className="mb-6">
          <h3 className="text-orange-400 font-semibold">Labatory Location</h3>
          <p>
            (우)17104 경기도 용인시 기흥구 덕영대로 1732
            <br />
            경희대학교 국제캠퍼스 천문대 KyungHee University National Campus Observatory
          </p>
        </div>

        <hr className="border-t border-foreground/20 my-8" />
        <p className="text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} Space Science Instrument Laboratory. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
