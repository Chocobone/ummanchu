import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string) {
  const abuf = Buffer.from(a);
  const bbuf = Buffer.from(b);
  if (abuf.length !== bbuf.length) return false;
  return crypto.timingSafeEqual(abuf, bbuf);
}

async function checkPassword(input: string, secret: string) {
  if (secret.startsWith("$2a$") || secret.startsWith("$2b$") || secret.startsWith("$2y$")) {
    return bcrypt.compare(input, secret);
  }
  return safeEqual(input, secret);
}

const authOptions: NextAuthOptions = {
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
        if (!adminEmail || !adminPassword) {
          console.error("ADMIN_EMAIL / ADMIN_PASSWORD not set");
          return null;
        }

        const emailOK = safeEqual(credentials.email, adminEmail);
        const pwOK = await checkPassword(credentials.password, adminPassword);
        if (!emailOK || !pwOK) return null;

        // 최소 정보만 세션에 담아 반환 (role 제거)
        return { id: "admin-1", email: adminEmail, name: "Administrator" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = (user as any).email;
        token.name = (user as any).name;
      }
      return token as any;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token as any).email;
     
      }
      return session;
    },
      async redirect({ url, baseUrl }) {
     // 상대 경로는 허용 → /admin/research OK
     if (url.startsWith("/")) return `${baseUrl}${url}`;
     // 같은 오리진의 절대 URL도 허용
     try {
       const u = new URL(url);
       if (u.origin === baseUrl) return url;
     } catch {}
     // 그 외는 기본 홈으로
     return baseUrl;
   }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
