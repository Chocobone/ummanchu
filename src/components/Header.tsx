"use client";  // App Router 의 client component 임을 명시

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "home", path: "/" },
    {name: "about", path: "about"},
    { name: "research",     path: "/research" },
    { name: "news",     path: "/news" },
    { name: "contact",     path: "/contact" },
    {name: "people", path: "/people"}
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="text-2xl font-bold text-primary">
            SSIL
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/70"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 액션 버튼 */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:shadow-glow">
              시작하기
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
