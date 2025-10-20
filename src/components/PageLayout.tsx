"use client";

import Header from "@/components/Navbar";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-white text-foreground transition-colors dark:bg-neutral-950 ${className}`}>
      <div className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-border">
        <Header />
      </div>

      <main className="pt-32 pb-20">{children}</main>
    </div>
  );
}