// middleware.ts (프로젝트 루트 또는 src 중 한 군데만! — 딱 1개)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // NextAuth와 동일한 SECRET 사용
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 미로그인 → /login?callbackUrl=<현재경로+쿼리> (절대 URL로)
  if (!token) {
    const current = req.nextUrl.pathname + req.nextUrl.search;
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", current);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
