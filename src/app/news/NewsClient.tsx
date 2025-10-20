'use client';

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import NewsCard from "./NewsCard";
import NewsForm from "./NewsForm";

interface NewsClientProps {
  initialNews: any[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [news, setNews] = useState(initialNews);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refreshList = useCallback(async () => {
    const res = await fetch("/api/news", { cache: "no-store" });
    const updated = await res.json();
    setNews(updated);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCreate(false);
    };
    if (showCreate) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCreate]);

  return (
    <div>
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">NEWS</h1>
        <p className="text-lg text-muted-foreground">
          Stay up to date with the latest news and announcements from SSIL.
        </p>
      </header>

      {/* Admin: Add (Create) Modal Trigger */}
      {isAdmin && (
        <div className="text-right mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
          >
            + Add News
          </button>
        </div>
      )}

      {/* News Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} isAdmin={isAdmin} />
        ))}
      </div>

      {/* Create Modal */}
      {isAdmin && showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <button
            aria-label="Close create modal"
            onClick={() => !submitting && setShowCreate(false)}
            className="absolute inset-0 bg-black/60"
          />
          {/* Dialog */}
          <div className="relative bg-white dark:bg-neutral-900 text-foreground w-full max-w-2xl rounded-2xl shadow-xl mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <h2 className="text-lg font-semibold">Add News</h2>
              <button
                onClick={() => !submitting && setShowCreate(false)}
                className="rounded-full px-3 py-1 text-sm hover:bg-foreground/5"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <NewsForm
                mode="create"
                onSuccess={async () => {
                  if (submitting) return;
                  setSubmitting(true);
                  await refreshList();
                  setSubmitting(false);
                  setShowCreate(false); // 생성 후 목록에 남아있고 모달만 닫힘
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
