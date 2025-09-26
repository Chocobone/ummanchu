// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

type ResearchNavItem = {
  label: string;
  href: string;
  cat: "Current" | "Completed";
};

const Header = () => {
  const pathname = usePathname();
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "RESEARCH", path: "/research" },
    {name: "PUBLICATION", path: "/publications"},
    { name: "NEWS", path: "/news" },
    { name: "CONTACT", path: "/contact" },
    { name: "PEOPLE", path: "/people" },
  ];

  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const closeSoon = () => {
    // ★ 기존 타이머를 지우고, 새로 설정 (덥석 닫히는 것 방지)
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  };

  // 라우트가 바뀌면 닫히도록
  useEffect(() => {
    setOpen(false);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [pathname]);

  const [researchNav, setResearchNav] = useState<ResearchNavItem[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // ⬇️ 드롭다운 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/research-nav");
        const data: ResearchNavItem[] = await res.json();
        setResearchNav(data);
      } catch {
        setResearchNav([]);
      }
    })();
  }, []);

  return (
    <header className="bg-background-rgb/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[105px]">
          <Link href="/" className="text-2xl font-bold text-primary">
           <Image
    src={isDark ? "/main/logo_trans_03.png" : "/main/logo_trans_01.png"}
    alt="SSIL Logo"
    width={177}
    height={88}
    priority
  />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.name !== "RESEARCH" ? (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`uppercase text-sm font-medium transition-colors hover:text-primary-rgb/100 ${
                    pathname === item.path ? "text-primary" : "text-foreground-rgb/70"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                // ★ group 클래스 제거, 호버 핸들러 추가
                <div
                  key="RESEARCH"
                  className="relative flex items-center"
                  onMouseEnter={openNow}   // ★
                  onMouseLeave={closeSoon} // ★
                >
                  <Link
                    href="/research"
                    className={`uppercase text-sm font-medium transition-colors hover:text-primary-rgb/100 ${
                      pathname.startsWith("/research") ? "text-primary" : "text-foreground-rgb/70"
                    }`}
                  >
                    RESEARCH
                  </Link>

                  {/* ★ 드롭다운: open 상태로 제어 (group-hover 제거) */}
                  {researchNav && researchNav.length > 0 && open && (
                    <div
                      className="absolute left-0 top-full mt-2 z-50"
                      onMouseEnter={openNow}   // ★ 패널로 이동해도 닫힘 취소
                      onMouseLeave={closeSoon} // ★ 패널에서 벗어날 때만 지연 닫힘
                    >
                      <div className="w-64 max-h-80 overflow-auto rounded-lg border bg-background shadow-lg py-2">
                        {researchNav.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            className="block px-4 py-2 text-sm text-foreground-rgb/80 hover:bg-foreground/5 whitespace-nowrap"
                          >
                            {it.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            <button
              onClick={() => setIsDark(!isDark)}
              className="ml-4 text-sm font-medium px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              {isDark ? "🌙 Dark" : "☀️ Light"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
