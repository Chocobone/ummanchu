'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PersonForm from '@/components/PeopleForm';
import Loading from '@/components/Loading';

export default function EditPersonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPerson = async () => {
        try {
          const res = await fetch(`/api/people/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch person data');
          }
          const data = await res.json();
          setInitialData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPerson();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/people/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update person');
      }

      router.push('/admin/people');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!initialData) return <div>Person not found.</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Person</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <PersonForm 
        initialData={initialData}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        buttonText="Update Person"
      />
    </div>
  );
}
