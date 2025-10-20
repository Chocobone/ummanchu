'use client';
console.log('[LoginForm] mounted'); 
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/research';
  const authError = searchParams.get('error');

  useEffect(() => {
    if (authError) setError('Invalid email or password. Please try again.');
   console.log("이메일 혹은 패스워드가 틀림 다시 시도")
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('[submit] start');
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,     // 반드시 전달
      redirect: false // NextAuth가 url을 반환하도록
    });

    if (result?.error) {
       console.log("이메일 혹은 패스워드가 틀림 다시 시도")
      setError("Invalid email or password. Please try again.");
    } else {
      // NextAuth가 알려준 목적지로 이동 (없으면 fallback)
      router.replace(result?.url ?? callbackUrl);
       console.log("NextAuth가 알려준 목적지로 가는중")
      router.refresh();
    }
  } catch (_) {
    setError("Unexpected error. Please try again.");
     console.log("에러 남 로그인 폼 에러")
  } finally {
    // ★ 성공이든 실패든 로딩 해제 (무한로딩 방지)
    setIsSubmitting(false);
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}