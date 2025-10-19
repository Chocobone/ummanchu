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
  const isAdmin = !!session;
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
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
          NEWS
        </h1>
        <p className="text-lg text-muted-foreground">
          Stay up to date with the latest news and announcements from SSIL.
        </p>
      </header>

      {/* Admin Add Button */}
      {isAdmin && (
        <div className="text-right mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
          >
            + Add News
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 text-foreground p-6 rounded-lg w-full max-w-2xl shadow-xl relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
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

      {/* News Grid */}
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