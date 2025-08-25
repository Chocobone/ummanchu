'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const RichEditor = dynamic(() => import('@/components/RichEditor'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

interface ResearchData {
    title: string;
    subtitle: string | null;
    description: string;
    imageUrl: string | null;
    status: 'IN_PROGRESS' | 'COMPLETED';
    startDate?: string | null;
    endDate?: string | null;
}

export default function EditResearchPage() {
  const [formData, setFormData] = useState<Partial<ResearchData>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchResearchData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/research/${id}`);
          if (!res.ok) throw new Error('Failed to fetch research data');
          const data = await res.json();
          setFormData({
            ...data,
            subtitle: data.subtitle || '',
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResearchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDescriptionChange = (html: string) => {
    setFormData(prev => ({ ...prev, description: html }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title || '');
    data.append('subtitle', formData.subtitle || '');
    data.append('description', formData.description || '');
    data.append('status', formData.status || 'IN_PROGRESS');
    data.append('startDate', formData.startDate || '');
    data.append('endDate', formData.endDate || '');
    if (file) {
      data.append('file', file);
    }

    try {
      const res = await fetch(`/api/research/${id}`, {
        method: 'PUT',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update research item');
      }

      router.push('/admin/research');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Research</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input id="title" name="title" type="text" value={formData.title || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-gray-700 font-bold mb-2">Subtitle</label>
          <input id="subtitle" name="subtitle" type="text" value={formData.subtitle || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Featured Image</label>
          {formData.imageUrl && (
            <div className="my-2">
              <p className="text-sm text-gray-600">Current image:</p>
              <Image src={formData.imageUrl} alt="Current image" width={200} height={100} className="object-cover rounded" />
            </div>
          )}
          <input id="file" type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
          <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                    <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="w-full p-2 border rounded h-40"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
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
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isSubmitting || isLoading}>
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