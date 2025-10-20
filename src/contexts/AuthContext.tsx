"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";

type AuthContextValue = {
  isAdmin: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // 예시: session.user.role === 'admin' 기준
  const isAdmin = (session?.user as any)?.role === "admin";

  const value = useMemo<AuthContextValue>(
    () => ({
      isAdmin,
      logout: () => signOut(),
    }),
    [isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}