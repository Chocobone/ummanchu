// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const pathname = usePathname();
  const navItems = [
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
    { name: "research", path: "/research" },
    { name: "news", path: "/news" },
    { name: "contact", path: "/contact" },
    { name: "people", path: "/people" },
    //{name: "blog-test", path: "/test"}
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
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
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.path
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <div key="research" className="relative group flex items-center">
                  <Link
                    href="/research"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname.startsWith("/research")
                        ? "text-primary"
                        : "text-foreground/70"
                    }`}
                  >
                    research
                  </Link>
                  {/* ── 드롭다운: 4개 프로젝트 링크만 수동 나열 */}
                <div className="absolute left-0 top-full mt-2 w-56 bg-background shadow-lg rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href="/research?cat=Current&idx=0"
                      className="block px-4 py-2 text-sm hover:bg-primary/10"
                    >
                      Current – LUSEM
                    </Link>
                    <Link
                      href="/research?cat=Completed&idx=0"
                      className="block px-4 py-2 text-sm hover:bg-primary/10"
                    >
                      Completed – CINEMA
                    </Link>
                    <Link
                      href="/research?cat=Completed&idx=1"
                      className="block px-4 py-2 text-sm hover:bg-primary/10"
                    >
                      Completed – MEPD
                    </Link>
                    <Link
                      href="/research?cat=Completed&idx=2"
                      className="block px-4 py-2 text-sm hover:bg-primary/10"
                    >
                      Completed – KSEM
                    </Link>
                  </div>
                </div>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;