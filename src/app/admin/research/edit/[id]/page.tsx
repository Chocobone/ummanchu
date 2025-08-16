'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichEditor from '@/components/RichEditor';

// Define the type for a research item
interface ResearchData {
    title: string;
    description: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    startDate?: string | null;
    endDate?: string | null;
}

export default function EditResearchPage() {
  const [formData, setFormData] = useState<ResearchData>({
    title: '',
    description: '',
    status: 'IN_PROGRESS',
    startDate: '',
    endDate: '',
  });
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
          if (!res.ok) {
            throw new Error('Failed to fetch research data');
          }
          const data = await res.json();
          // Format dates for the input[type="date"]
          setFormData({
            ...data,
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

  const handleDescriptionChange = (html: string) => {
    setFormData(prev => ({ ...prev, description: html }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      const res = await fetch(`/api/research/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
              initialValue={formData.description}
              onChange={handleDescriptionChange}
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
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
