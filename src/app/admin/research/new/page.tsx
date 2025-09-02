'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import type { ComponentProps } from 'react';
import type RichEditorComponent from '@/components/RichEditor';

// Dynamically import the RichEditor to prevent SSR issues
const RichEditor = dynamic(() => import('@/components/RichEditor'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
}) as React.ComponentType<ComponentProps<typeof RichEditorComponent>>;


// 스키마의 enum 값과 정확히 일치
type ResearchStatus = 'IN_PROGRESS' | 'COMPLETED';

export default function NewResearchPage() {
  const router = useRouter();

  // 기본 텍스트
  const [title, setTitle] = useState('');
  // 선택: 요약/인트로 같은 plain text를 쓰고 싶다면 유지
  const [description, setDescription] = useState(''); 

  // 리치 텍스트는 contentHtml로 보냄
  const [contentHtml, setContentHtml] = useState('');

  const [status, setStatus] = useState<ResearchStatus>('IN_PROGRESS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    if (description) formData.append('description', description); // 선택 필드
    if (contentHtml) formData.append('contentHtml', contentHtml); // 🔹 서버에서 sanitize됨
    formData.append('status', status);
    if (startDate) formData.append('startDate', startDate);
    if (endDate) formData.append('endDate', endDate);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create research item');
      }

      router.push('/admin/research');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Research</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* 선택: 요약/인트로(plain text) */}
        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Summary (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Short summary shown in list cards, etc."
          />
        </div>

        {/* 본문: 리치 텍스트 → contentHtml 로 보냄 */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <RichEditor value={contentHtml} onChange={setContentHtml} />
        </div>

        <div>
          <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Featured Image</label>
          <input id="file" type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ResearchStatus)}
            className="w-full p-2 border rounded"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}