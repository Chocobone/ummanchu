import { Suspense } from "react";
import LoginForm from "./LoginForm";
export const dynamic = 'force-dynamic';
import { noStore } from 'next/cache';
export default function LoginPage() {
  noStore();
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
