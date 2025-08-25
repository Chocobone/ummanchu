'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Define the type for a news item based on our schema
interface News {
  id: string;
  title: string;
  publishedAt: string;
  imageUrl?: string;
}

export default function NewsAdminPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login?callbackUrl=/admin/news');
    }
  }, [session, status, router]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      if (!res.ok) {
        throw new Error('Failed to fetch news data');
      }
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchNews();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete news item');
        }

        fetchNews();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (status === 'loading' || !session || session.user?.role !== 'admin') {
    return <div>Loading authentication...</div>;
  }
  if (loading) return <div>Loading news...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News Management</h1>
        <Link href="/admin/news/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New News
        </Link>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(item.publishedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="News Image" className="h-10 w-10 object-cover rounded" />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/news/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
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
