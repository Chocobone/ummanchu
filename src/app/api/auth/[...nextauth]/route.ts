// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

const authOptions = {
  session: { strategy: "jwt" as const },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1) 이메일로 사용자 조회
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        // 2) 관리자만 통과
        if (user.role !== "admin") return null;

        // 3) bcrypt로 해시 비교 (DB는 해시 저장됨)
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // 4) 세션/JWT에 넣을 최소 정보 리턴
        return { id: String(user.id), email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
