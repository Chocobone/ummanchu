'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonForm from '@/components/PeopleForm';

export default function NewPersonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create person');
      }

      router.push('/admin/people');
      router.refresh(); // To reflect the new data on the list page
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Person</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <PersonForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        buttonText="Create Person"
      />
    </div>
  );
}
