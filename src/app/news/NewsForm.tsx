'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React from 'react';

const RichEditor = dynamic<{ value: string; onChange: (html: string) => void }>(
  () => import('@/components/RichEditor'),
  { ssr: false, loading: () => <p>Loading editor...</p> }
);

interface NewsFormProps {
  mode: 'create' | 'edit';
  newsId?: string;
  defaultValues?: any;
  onSuccess?: () => void;
}

export default function NewsForm({ mode, newsId, defaultValues, onSuccess }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: defaultValues?.title || '',
    description: defaultValues?.description || '',
    imageUrl: defaultValues?.imageUrl || '',
    publishedAt:
      typeof defaultValues?.publishedAt === 'string'
        ? defaultValues.publishedAt.split('T')[0]
        : new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      const data = await res.json();
      setFormData((p) => ({ ...p, imageUrl: data.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(newsId ? `/api/news/${newsId}` : '/api/news', {
        method: newsId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: new Date(formData.publishedAt).toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to save news');
      onSuccess?.();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md border border-border transition-colors"
    >
      {/* Title */}
      <div>
        <label className="block font-semibold mb-2 text-foreground">Title</label>
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-border rounded-md p-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Enter news title"
          required
        />
      </div>

      {/* Published Date */}
      <div>
        <label className="block font-semibold mb-2 text-foreground">Published Date</label>
        <input
          type="date"
          value={formData.publishedAt}
          onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
          className="border border-border rounded-md p-2 w-full bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-2 text-foreground">Description</label>
        <div className="rounded-md border border-border bg-background">
          <RichEditor
            value={formData.description}
            onChange={(html) => setFormData({ ...formData, description: html })}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-semibold mb-2 text-foreground">Image (optional)</label>
        {formData.imageUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={formData.imageUrl}
              alt="preview"
              className="w-24 h-16 object-cover rounded border border-border"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, imageUrl: '' })}
              className="text-red-500 hover:text-red-400 transition"
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-primary/10 file:text-primary hover:file:bg-primary/20
                       cursor-pointer transition"
          />
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}