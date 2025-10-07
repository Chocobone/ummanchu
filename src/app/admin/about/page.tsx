"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { unstable_noStore as noStore } from 'next/cache';
import Loading from "@/components/Loading";
type AboutContent = {
  heading: string;
  tagline: string;
  body1: string;
  body2: string;
  professorName: string;
  professorImageUrl: string;
  highlightTitle: string;
  highlight1: string;
  highlight2: string;
  groupPhotoUrl: string;
};

export default function ManageAboutPage() {
   noStore();
  const [content, setContent] = useState<Partial<AboutContent>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/about/content");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setContent(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent((p) => ({ ...p, [name]: value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/about/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Saved!");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Manage About Page</h1>
      {err && <p className="text-red-500">{err}</p>}

      <form onSubmit={onSave} className="space-y-6 bg-card p-6 rounded border border-border-rgb/20">
        <div>
          <label className="font-semibold">Heading</label>
          <input name="heading" value={content.heading || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Tagline</label>
          <input name="tagline" value={content.tagline || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Body 1</label>
          <textarea name="body1" rows={4} value={content.body1 || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Body 2</label>
          <textarea name="body2" rows={4} value={content.body2 || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <hr className="border-border-rgb/20" />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Professor Name</label>
            <input name="professorName" value={content.professorName || ""} onChange={onChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="font-semibold">Professor Image URL</label>
            <input name="professorImageUrl" value={content.professorImageUrl || ""} onChange={onChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <hr className="border-border-rgb/20" />

        <div>
          <label className="font-semibold">Highlight Title</label>
          <input name="highlightTitle" value={content.highlightTitle || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Highlight Body 1</label>
          <textarea name="highlight1" rows={5} value={content.highlight1 || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Highlight Body 2</label>
          <textarea name="highlight2" rows={5} value={content.highlight2 || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Group Photo URL</label>
          <input name="groupPhotoUrl" value={content.groupPhotoUrl || ""} onChange={onChange} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" disabled={saving} className="bg-primary text-primary-foreground px-4 py-2 rounded">
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      {/* 미리보기(선택) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded border border-border-rgb/20 bg-card-rgb/10">
          <div className="text-sm text-foreground-rgb/60 mb-2">Professor Image Preview</div>
          <div className="relative w-full h-64 rounded overflow-hidden">
            {content.professorImageUrl ? (
              <Image src={content.professorImageUrl} alt="professor" fill className="object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-foreground-rgb/50">No image</div>
            )}
          </div>
        </div>
        <div className="p-4 rounded border border-border-rgb/20 bg-card-rgb/10">
          <div className="text-sm text-foreground-rgb/60 mb-2">Group Photo Preview</div>
          <div className="relative w-full h-64 rounded overflow-hidden">
            {content.groupPhotoUrl ? (
              <Image src={content.groupPhotoUrl} alt="group" fill className="object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-foreground-rgb/50">No image</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
