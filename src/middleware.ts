// middleware.ts (또는 src/middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // 이 함수는 config.matcher에 의해 /admin, /api/admin 만 들어옵니다.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1) 비로그인 → /login?callbackUrl=원래경로
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 2) 로그인했지만 admin 아님 → /
  if ((token as any).role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // i18n 써도 안전하게 매칭되도록 /admin 과 /api/admin 만 지정
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
