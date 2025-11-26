"use client";

import { Moon, Sun, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";



const Navbar = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  const [researchOpen, setResearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 
  const openNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setResearchOpen(true);
  };

  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setResearchOpen(false), 3000);
  };

 
  useEffect(() => setMounted(true), []);

  // navbar hide/show on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const goingDown = y > lastYRef.current;
          const pastHeader = y > 10;
          setHidden(goingDown && pastHeader);
          lastYRef.current = y;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { path: "/", label: "소개" },
    { path: "/generator", label: "제네레이터" },
    { path: "/price", label: "가격" },
    { path: "/my", label: "내 계정" },
    { path: "/start", label: "시작하기" }
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const lightBg = "bg-white/100 supports-[backdrop-filter]:bg-white/60 backdrop-blur";
  const darkBg = "bg-background/100 supports-[backdrop-filter]:bg-background/60 backdrop-blur";
  const tone = mounted && resolvedTheme === "light" ? lightBg : darkBg;

  return (
    <nav
      className={[
        "fixed top-0 z-50 w-full h-[100px] border-b transition-transform duration-300 will-change-transform",
        hidden ? "-translate-y-full" : "translate-y-0",
        tone,
      ].join(" ")}
    >
      <div className="container flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-10">
          {/* LOGO */}
          <Link href="/" aria-label="Home" className="flex items-center justify-center">
            {mounted && (
              <>
              <Image
                key={resolvedTheme}
                src={
                  resolvedTheme === "dark"
                    ? "/main/logo_trans_03.png?v=1"
                    : "/main/logo_trans_01.png?v=1"
                }
                alt="Logo"
                width={180}
                height={180}
                priority
              />
          
    </>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center h-[72px] gap-12 ml-20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center text-xl font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                <Menu className="h-3 w-3" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className={`w-[240px] ${tone} flex flex-col`}>
              <div className="flex-1 flex flex-col gap-4 mt-8 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium transition-colors px-2 py-2 rounded
                      hover:bg-gray-300 dark:hover:text-primary/80
                      ${
                        isActive(item.path)
                          ? "bg-gray-200 text-primary dark:bg-primary/10"
                          : "text-gray-800 dark:text-muted-foreground"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="rounded-xl"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
