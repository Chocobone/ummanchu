"use client";

import Header from "@/components/Navbar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  const pathname = usePathname();

  // research는 그대로, 나머지는 아래로
  const mainOffset =
    pathname.startsWith("/research") ? "translate-y-0" : "translate-y-[100px]";

  return (
    <div
      className={`min-h-screen bg-white text-foreground transition-colors dark:bg-neutral-950 ${className}`}
    >
      <Header />
      <main
        className={`pt-[100px] pb-20 transform transition-transform duration-300 ease-in-out ${mainOffset}`}
      >
        {children}
      </main>
    </div>
  );
}
