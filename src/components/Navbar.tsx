"use client";

import { Moon, Sun, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type ResearchNavItem = {
  label: string;
  href: string;
  cat: "Current" | "Completed";
};

const Navbar = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  // ✅ Research dropdown 전용 상태
  const [researchOpen, setResearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [researchNav, setResearchNav] = useState<ResearchNavItem[]>([]);

  const openNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setResearchOpen(true);
  };

  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // ✅ 3초 뒤에 닫힘
    closeTimer.current = setTimeout(() => setResearchOpen(false), 3000);
  };

  // ✅ research-nav API 호출
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

  useEffect(() => setMounted(true), []);

  // ✅ 스크롤 시 Nav 숨김
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
    "fixed top-0 z-50 w-full h-[100px] border-b transition-transform duration-300 will-change-transform",
    hidden ? "-translate-y-full" : "translate-y-0",
    tone,
  ].join(" ")}
><div className="container flex h-full items-center justify-between px-6">
  <div className="flex items-center gap-10">
    <Link
      href="/"
      aria-label="SSIL Home"
      className="flex items-center justify-center"
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

    {/* ✅ 메뉴 높이 정렬 */}
    <div className="flex items-center h-[72px] gap-8">
      {navItems.map((item) =>
        item.label !== "Research" ? (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ) : (
          <div
            key="Research"
            className="relative flex items-center"
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
          >
            <Link
              href="/research"
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                isActive("/research")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Research
            </Link>

            {researchOpen && researchNav.length > 0 && (
              <div
                className="absolute left-0 top-full mt-2 bg-white dark:bg-neutral-900 border rounded-md shadow-lg z-[9999]"
                onMouseEnter={openNow}
                onMouseLeave={closeSoon}
              >
                <ul className="min-w-[220px] p-2">
                  {researchNav.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                      >
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
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
                    className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md ${
                      isActive(item.path)
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

          {status === "authenticated" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden md:flex rounded"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
          )}

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
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
