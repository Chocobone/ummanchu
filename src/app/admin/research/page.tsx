'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the type for a research item based on our schema
interface Research {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export default function ResearchAdminPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchResearch = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/research');
      if (!res.ok) {
        throw new Error('Failed to fetch research data');
      }
      const data = await res.json();
      setResearch(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`/api/research/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete research item');
        }

        // Refresh the list after deletion
        fetchResearch();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Research Management</h1>
        <Link href="/admin/research/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Research
        </Link>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {research.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/research/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
