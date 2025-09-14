'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import type RichEditorComponent from '@/components/RichEditor';

const RichEditor = dynamic(() => import('@/components/RichEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
}) as React.ComponentType<ComponentProps<typeof RichEditorComponent>>;

type ResearchStatus = 'IN_PROGRESS' | 'COMPLETED';

interface ResearchData {
  title: string;
  description: string | null;
  contentHtml: string | null;
  imageUrl: string | null;
  status: ResearchStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export default function EditResearchPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [formData, setFormData] = useState<Partial<ResearchData>>({});
  const [contentHtml, setContentHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          imageUrl: data.imageUrl ?? '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/research/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title || '',
          description: formData.description || null,
          contentHtml: contentHtml || null,
          imageUrl: formData.imageUrl || null,           // ✅ URL만 전송
          status: (formData.status as ResearchStatus) || 'IN_PROGRESS',
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update research item');
      router.push('/admin/research');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Research</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input id="title" name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Summary (optional)</label>
          <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 border rounded h-28" />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <RichEditor value={contentHtml} onChange={setContentHtml} />
        </div>

        {/* ✅ URL 입력 + 미리보기 */}
        <div>
          <label htmlFor="imageUrl" className="block text-gray-700 font-bold mb-2">Image URL</label>
          <input id="imageUrl" name="imageUrl" value={(formData.imageUrl as string) || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="/images/foo.jpg 또는 https://example.com/foo.jpg" />
          {(formData.imageUrl as string) ? (
            <div className="relative mt-3 h-40 w-full max-w-md overflow-hidden rounded">
              <Image src={formData.imageUrl as string} alt="Preview" fill className="object-cover" />
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
          <select id="status" name="status" value={formData.status || 'IN_PROGRESS'} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
            <input id="startDate" name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
            <input id="endDate" name="endDate" type="date" value={formData.endDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
          <button type="button" onClick={() => router.back()} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
