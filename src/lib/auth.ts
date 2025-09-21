// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function safeEqual(a: string, b: string) {
  const abuf = Buffer.from(a);
  const bbuf = Buffer.from(b);
  if (abuf.length !== bbuf.length) return false;
  return crypto.timingSafeEqual(abuf, bbuf);
}

// ADMIN_PASSWORD가 bcrypt 해시면 bcrypt 비교, 아니면 안전한 평문 비교
async function checkPassword(input: string, secret: string) {
  if (secret.startsWith("$2a$") || secret.startsWith("$2b$") || secret.startsWith("$2y$")) {
    return bcrypt.compare(input, secret);
  }
  return safeEqual(input, secret);
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!credentials?.email || !credentials?.password) return null;
        if (!adminEmail || !adminPassword) return null;

        const emailOK = safeEqual(credentials.email, adminEmail);
        const pwOK = await checkPassword(credentials.password, adminPassword);
        if (!emailOK || !pwOK) return null;

        // role 없이 최소 정보만
        return { id: "admin-1", email: adminEmail, name: "Administrator" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = (user as any).email;
        token.name = (user as any).name;
          console.log("JWT 콜백")
      }
      return token as any;
    },
    async session({ session, token }) {
      if (session.user) {
         console.log("세션 콜백")
        session.user.email = (token as any).email;
      }
      return session;
    },
      async redirect({ url, baseUrl }) {
    // 같은 오리진의 상대/절대 경로만 허용
      console.log("redirect 콜백")
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    try {
      const u = new URL(url);
      if (u.origin === baseUrl) return url;
    } catch {}
    // 그 외는 기본
    return baseUrl;
  }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
