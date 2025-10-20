'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicationForm, { PublicationFormValues } from '@/components/PublicationForm';

export default function NewPublicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: PublicationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Failed to create publication');
      }
      router.push('/admin/publications'); // 리스트 페이지 경로에 맞춰 조정
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Publication</h1>
      {error && (
        <div className="bg-red-950/30 border border-red-400 text-red-200 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      <PublicationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} buttonText="Create Publication" />
    </div>
  );
}
