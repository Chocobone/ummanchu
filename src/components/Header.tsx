// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React ,{ useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "RESEARCH", path: "/research" },
    { name: "NEWS", path: "/news" },
    { name: "CONTACT", path: "/contact" },
    { name: "PEOPLE", path: "/people" }

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