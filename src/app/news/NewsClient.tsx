'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import NewsForm from "./NewsForm";
import NewsCard from "./NewsCard";

interface NewsClientProps {
  initialNews: any[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  const { data: session } = useSession();
  const isAdmin = !!session; // 관리자 여부 간단히 판단
  const [news, setNews] = useState(initialNews);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSave = async () => {
    const res = await fetch("/api/news");
    const updated = await res.json();
    setNews(updated);
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <div>
      <header className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
          NEWS
        </h1>
        <p className="text-lg text-gray-600">
          Stay up to date with the latest news and announcements from SSIL.
        </p>
      </header>

      {isAdmin && (
        <div className="text-right mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add News
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-2xl shadow-xl">
            <button
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
              className="text-gray-500 hover:text-gray-800 float-right"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit News" : "Add News"}
            </h2>
            <NewsForm
              mode={editItem ? "edit" : "create"}
              newsId={editItem?.id}
              defaultValues={editItem}
              onSuccess={handleSave}
            />
          </div>
        </div>
      )}

      {/* 리스트 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            onEdit={() => {
              setEditItem(item);
              setShowForm(true);
            }}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}