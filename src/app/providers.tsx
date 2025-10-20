"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}