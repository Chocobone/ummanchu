// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React ,{ useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const navItems = [
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
    { name: "research", path: "/research" },
    { name: "news", path: "/news" },
    { name: "contact", path: "/contact" },
    { name: "people", path: "/people" }

  ];
const [isDark, setIsDark] = useState(false);
 useEffect(() => {
    // localStorage에 저장된 테마 불러오기
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="bg-background-rgb/80 backdrop-blur-md border-b sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            SSIL
          </Link>

        <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.name !== "research" ? (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-rgb/100 ${
                    pathname === item.path
                      ? "text-primary"
                      : "text-foreground-rgb/70"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <div key="research" className="relative group flex items-center">
                  <Link
                    href="/research"
                    className={`text-sm font-medium transition-colors hover:text-primary-rgb/100 ${
                      pathname.startsWith("/research")
                        ? "text-primary"
                        : "text-foreground-rgb/70"
                    }`}
                  >
                    research
                  </Link>
                  {/* ── 드롭다운: 4개 프로젝트 링크만 수동 나열 */}
                <div className="absolute left-0 top-full mt-2 w-56 bg-background shadow-lg rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href="/research?cat=Current&idx=0"
                      className="block px-4 py-2 text-sm hover:bg-primary-rgb/10"
                    >
                      Current – LUSEM
                    </Link>
                    <Link
                      href="/research?cat=Completed&idx=0"
                      className="block px-4 py-2 text-sm hover:bg-primary-rgb/10"
                    >
                      Completed – CINEMA
                    </Link>
                    <Link
                      href="/research?cat=Completed&idx=1"
                      className="block px-4 py-2 text-sm hover:bg-primary-rgb/10"
                    >
                      Completed – MEPD
                    </Link>
                    <Link
                      href="/research?cat=Completed&idx=2"
                      className="block px-4 py-2 text-sm hover:bg-primary-rgb/10"
                    >
                      Completed – KSEM
                    </Link>
                  </div>
                </div>
              )
            )}
           {/* 다크모드 토글 버튼 */}
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