'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import type { ComponentProps } from 'react';
import type RichEditorComponent from '@/components/RichEditor';

// Dynamically import the RichEditor to prevent SSR issues
const RichEditor = dynamic(() => import('@/components/RichEditor'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
}) as React.ComponentType<ComponentProps<typeof RichEditorComponent>>;

// Define the type for a news item
interface NewsData {
    title: string;
    description: string;
    imageUrl?: string | null;
    publishedAt: string;
}

export default function EditNewsPage() {
  const [formData, setFormData] = useState<NewsData>({
    title: '',
    description: '',
    imageUrl: '',
    publishedAt: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { data: session, status } = useSession();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/admin/news/edit/${id}`);
    }
  }, [session, status, router, id]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchNewsData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/news/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch news data');
          }
          const data = await res.json();
          setFormData({
            ...data,
            publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          });
          setImageUrl(data.imageUrl);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNewsData();
    }
  }, [id, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html: string) => {
    setFormData(prev => ({ ...prev, description: html }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setImageUrl(data.url); // 업로드 후 받은 url 저장
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : new Date().toISOString(),
      };

      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update news item');
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'unauthenticated') {
    return <div>Loading authentication...</div>;
  }
  if (isLoading) return <div>Loading news data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit News</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
          {!isLoading && (
            <RichEditor
              value={formData.description}
              onChange={handleDescriptionChange}
            />
          )}
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">썸네일 이미지 (Optional)</label>
          {imageUrl ? (
            <div className="space-y-2">
              <img src={imageUrl} alt="Thumbnail preview" className="w-48 h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Change Image
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full 
                         file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                         hover:file:bg-blue-100"
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="publishedAt" className="block text-gray-700 font-bold mb-2">Published Date</label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            value={formData.publishedAt}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}