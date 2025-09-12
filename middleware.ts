// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // 여기까지 들어온 건 모두 /admin 경로
    const token = (req as any).nextauth?.token;
    const isAdmin = token?.role === "admin";

    // 로그인은 했지만 admin이 아니면 홈으로
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // ★ /admin 은 "로그인 필수"
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token; // 로그인 안되어 있으면 false -> 자동으로 /login?callbackUrl=... 로 보냄
        }
        return true;
      },
    },
    pages: {
      signIn: "/login", // 로그인 페이지
    },
  }
);

// '/admin' 루트와 하위 전부 매칭
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
