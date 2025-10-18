"use client";

import { Moon, Sun, LogOut, LogIn, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { isAdmin, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 스크롤 방향 감지 (내릴 땐 숨기고, 올리면 보이기)
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const goingDown = y > lastYRef.current;
          const pastHeader = y > 10; // 살짝 스크롤했을 때만 동작
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
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/research", label: "Research" },
    { path: "/publications", label: "Publications" },
    { path: "/news", label: "News" },
    { path: "/people", label: "People" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const lightBg =
    "bg-white/100 supports-[backdrop-filter]:bg-white/60 backdrop-blur";
  const darkBg =
    "bg-background/100 supports-[backdrop-filter]:bg-background/60 backdrop-blur";
  const tone = mounted && resolvedTheme === "light" ? lightBg : darkBg;

  return (
    <nav
      className={[
        "py-2 sticky top-0 z-50 w-full border-b transition-transform duration-300 will-change-transform",
        hidden ? "-translate-y-full" : "translate-y-0",
        tone,
      ].join(" ")}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="SSIL Home"
            className="text-xl font-bold text-primary"
          >
            {mounted && (
              <Image
                key={resolvedTheme}
                src={
                  resolvedTheme === "dark"
                    ? "/main/logo_trans_03.png"
                    : "/main/logo_trans_01.png"
                }
                alt="SSIL Logo"
                width={160}
                height={70}
                priority
              />
            )}
          </Link>

          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`w-[240px] ${tone}`}>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md ${isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {isAdmin &&
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
          }

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;