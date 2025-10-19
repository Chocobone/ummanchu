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
        publishedAt: defaultValues?.publishedAt
            ? new Date(defaultValues.publishedAt).toISOString().split('T')[0]
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
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md border">
            <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Description</label>
                <RichEditor value={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} />
            </div>

            <div>
                <label className="block font-semibold mb-1">Image (optional)</label>
                {formData.imageUrl ? (
                    <div className="flex items-center gap-2">
                        <img src={formData.imageUrl} alt="preview" className="w-24 h-16 object-cover rounded" />
                        <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="text-red-500">
                            Remove
                        </button>
                    </div>
                ) : (
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                )}
            </div>

            <div>
                <label className="block font-semibold mb-1">Published Date</label>
                <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="border rounded p-2"
                    required
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}