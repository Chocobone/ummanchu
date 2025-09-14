"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { unstable_noStore as noStore } from 'next/cache';
export const dynamic = 'force-dynamic';
export default function AdminPage() {
   noStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login?callbackUrl=/admin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        세션 확인 중...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">관리자 전용 페이지</h1>
        <p className="text-lg text-gray-300">
          환영합니다, <span className="font-semibold">{session?.user?.email}</span> 님 🎉
        </p>
      </div>
    </main>
  );
}
