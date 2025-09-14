'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type RichEditorComponent from '@/components/RichEditor';

const RichEditor = dynamic(() => import('@/components/RichEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
}) as React.ComponentType<ComponentProps<typeof RichEditorComponent>>;

type ResearchStatus = 'IN_PROGRESS' | 'COMPLETED';

export default function NewResearchPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');  // plain text
  const [contentHtml, setContentHtml] = useState('');  // rich text
  const [imageUrl, setImageUrl] = useState('');        // ✅ URL only
  const [status, setStatus] = useState<ResearchStatus>('IN_PROGRESS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          contentHtml: contentHtml || null,
          imageUrl: imageUrl || null,               // ✅ URL만 전송
          status,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create research item');
      router.push('/admin/research');
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Research</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Summary (optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-28" />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <RichEditor value={contentHtml} onChange={setContentHtml} />
        </div>

        {/* ✅ URL만 입력 */}
        <div>
          <label htmlFor="imageUrl" className="block text-gray-700 font-bold mb-2">Image URL</label>
          <input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border rounded" placeholder="/images/foo.jpg 또는 https://example.com/foo.jpg" />
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ResearchStatus)} className="w-full p-2 border rounded">
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={() => router.back()} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
