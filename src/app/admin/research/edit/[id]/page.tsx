'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import type RichEditorComponent from '@/components/RichEditor';

// Dynamically import the RichEditor to prevent SSR issues
const RichEditor = dynamic(() => import('@/components/RichEditor'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
}) as React.ComponentType<ComponentProps<typeof RichEditorComponent>>;


type ResearchStatus = 'IN_PROGRESS' | 'COMPLETED';

interface ResearchData {
  title: string;
  description: string | null;   // 요약용(plain text) — 선택
  contentHtml: string | null;   // 본문(리치텍스트)
  imageUrl: string | null;
  status: ResearchStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export default function EditResearchPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam; // ✅ 보정

  const [formData, setFormData] = useState<Partial<ResearchData>>({});
  const [contentHtml, setContentHtml] = useState<string>(''); // ✅ 에디터 상태
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/research/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch research data');
        const data: ResearchData & { createdAt: string } = await res.json();
        setFormData({
          title: data.title,
          description: data.description ?? '',
          imageUrl: data.imageUrl ?? null,
          status: data.status,
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
        });
        setContentHtml(data.contentHtml ?? '');
      } catch (err: any) {
        setError(err.message ?? 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  // 입력 공통 핸들러(plain inputs)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.append('title', formData.title || '');
    fd.append('description', formData.description || ''); // 선택 필드(요약)
    fd.append('contentHtml', contentHtml || '');          // ✅ 본문
    fd.append('status', (formData.status as ResearchStatus) || 'IN_PROGRESS');
    fd.append('startDate', formData.startDate || '');
    fd.append('endDate', formData.endDate || '');
    if (file) fd.append('file', file);

    try {
      const res = await fetch(`/api/research/${id}`, { method: 'PUT', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update research item');
      }
      router.push('/admin/research');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Research</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* 요약: plain text (선택) */}
        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Summary (optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded h-28"
            placeholder="Short summary shown in list, SEO description, etc."
          />
        </div>

        {/* 본문: 리치 텍스트 */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <RichEditor
            value={contentHtml}
            onChange={setContentHtml}
            uploadEndpoint="/api/upload"
            uploadExtra={{ ownerType: 'RESEARCH', ownerId: id, tag: 'inline' }}
          />
          
        </div>

        <div>
          <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Featured Image</label>
          {formData.imageUrl && (
            <div className="my-2">
              <p className="text-sm text-gray-600">Current image:</p>
              <Image
                src={formData.imageUrl}
                alt="Current image"
                width={360}
                height={200}
                className="object-cover rounded"
              />
            </div>
          )}
          <input id="file" type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
          <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status || 'IN_PROGRESS'}
            onChange={handleChange}
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
              name="startDate"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
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