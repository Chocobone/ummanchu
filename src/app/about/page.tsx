'use client';

import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { defaultAbout } from "@/lib/aboutContent";
import PageLayout from "@/components/PageLayout";

export const dynamic = "force-dynamic";

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
  subheading?: string;
};

export default function AboutPage() {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [content, setContent] = useState<Partial<AboutContent> | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<AboutContent>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const merged = useMemo(
    () => ({ ...defaultAbout, ...(content || {}) }) as AboutContent,
    [content]
  );

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about/content", { cache: "no-store" });
        const data = await res.json();
        setContent(data);
      } catch {
        setContent(defaultAbout);
      }
    };
    fetchAbout();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
  };

  const startEdit = () => {
    setDraft(merged);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft({});
    setErr(null);
  };

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      const getRes = await fetch("/api/about/content", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const serverNow = getRes.ok ? await getRes.json() : {};
      const payload = { ...serverNow, ...draft };
      const putRes = await fetch("/api/about/content", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!putRes.ok) {
        const t = await putRes.text();
        throw new Error(t || "Failed to save");
      }
      const updated = await putRes.json();
      setContent(updated);
      setEditing(false);
    } catch (e: any) {
      setErr(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </PageLayout>
    );
  }

  const c = editing ? ({ ...merged, ...draft } as AboutContent) : merged;

  return (
    <PageLayout>
      <main className="relative pt-10">
        {isAdmin && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
            {!editing ? (
              <>
                <Link href="/admin/about">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 rounded">
                    <Edit className="w-4 h-4" />
                    Edit in the Panel
                  </Button>
                </Link>
                <Button className="rounded" variant="default" size="sm" onClick={startEdit}>Inline Edit</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <header className="text-center mb-16">
            {!editing ? (
              <>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{c.heading}</h1>
                {c.subheading && (
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.subheading}</p>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <input
                  name="heading"
                  value={c.heading || ""}
                  onChange={onChange}
                  className="w-full text-4xl lg:text-5xl font-bold tracking-tight bg-transparent border-b border-border p-2 outline-none"
                  placeholder="Heading"
                />
                <input
                  name="subheading"
                  value={c.subheading || ""}
                  onChange={onChange}
                  className="w-full text-lg text-muted-foreground bg-transparent border-b border-border p-2 outline-none"
                  placeholder="Subheading"
                />
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              {!editing ? (
                <>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-primary">{c.tagline}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{c.body1}</p>
                  {c.body2 && <p className="text-lg text-muted-foreground leading-relaxed">{c.body2}</p>}
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    name="tagline"
                    value={c.tagline || ""}
                    onChange={onChange}
                    className="w-full text-2xl lg:text-3xl font-extrabold text-primary bg-transparent border-b border-border p-2 outline-none"
                    placeholder="Tagline"
                  />
                  <textarea
                    name="body1"
                    value={c.body1 || ""}
                    onChange={onChange}
                    rows={5}
                    className="w-full text-lg bg-transparent border rounded p-3"
                    placeholder="Body 1"
                  />
                  <textarea
                    name="body2"
                    value={c.body2 || ""}
                    onChange={onChange}
                    rows={5}
                    className="w-full text-lg bg-transparent border rounded p-3"
                    placeholder="Body 2"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              {!editing ? (
                <>
                  <Image
                    src={c.professorImageUrl}
                    alt="Professor"
                    width={450}
                    height={450}
                    className="rounded-2xl shadow-lg object-cover"
                  />
                  {c.professorName && (
                    <p className="mt-4 text-sm text-muted-foreground font-medium">{c.professorName}</p>
                  )}
                </>
              ) : (
                <div className="w-full max-w-md space-y-3">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border">
                    {c.professorImageUrl ? (
                      <Image src={c.professorImageUrl} alt="Professor" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-muted-foreground">No image</div>
                    )}
                  </div>
                  <input
                    name="professorImageUrl"
                    value={c.professorImageUrl || ""}
                    onChange={onChange}
                    className="w-full bg-transparent border rounded p-2"
                    placeholder="Professor Image URL"
                  />
                  <input
                    name="professorName"
                    value={c.professorName || ""}
                    onChange={onChange}
                    className="w-full bg-transparent border rounded p-2"
                    placeholder="Professor Name"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-10 mb-20 bg-primary/10 border border-primary/20">
            {!editing ? (
              <>
                {c.highlightTitle && (
                  <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">{c.highlightTitle}</h2>
                )}
                {c.highlight1 && (
                  <p className="text-lg leading-relaxed text-foreground mb-6">{c.highlight1}</p>
                )}
                {c.highlight2 && <p className="text-lg leading-relaxed text-foreground">{c.highlight2}</p>}
              </>
            ) : (
              <div className="space-y-4">
                <input
                  name="highlightTitle"
                  value={c.highlightTitle || ""}
                  onChange={onChange}
                  className="w-full text-2xl lg:text-3xl font-bold text-primary bg-transparent border-b border-border p-2 outline-none"
                  placeholder="Highlight Title"
                />
                <textarea
                  name="highlight1"
                  value={c.highlight1 || ""}
                  onChange={onChange}
                  rows={4}
                  className="w-full bg-transparent border rounded p-3"
                  placeholder="Highlight Body 1"
                />
                <textarea
                  name="highlight2"
                  value={c.highlight2 || ""}
                  onChange={onChange}
                  rows={4}
                  className="w-full bg-transparent border rounded p-3"
                  placeholder="Highlight Body 2"
                />
              </div>
            )}
          </div>

          {(!editing && c.groupPhotoUrl) ? (
            <div className="mb-24">
              <Image
                src={c.groupPhotoUrl}
                alt="SSIL Group"
                width={1200}
                height={800}
                className="w-full rounded-2xl shadow-xl object-cover"
              />
              <p className="mt-3 text-sm text-center text-muted-foreground">SSIL Research Group</p>
            </div>
          ) : editing ? (
            <div className="mb-24 space-y-3">
              <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border">
                {c.groupPhotoUrl ? (
                  <Image src={c.groupPhotoUrl} alt="SSIL Group" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground">No image</div>
                )}
              </div>
              <input
                name="groupPhotoUrl"
                value={c.groupPhotoUrl || ""}
                onChange={onChange}
                className="w-full bg-transparent border rounded p-2"
                placeholder="Group Photo URL"
              />
            </div>
          ) : null}
        </div>

        {err && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded bg-red-600 text-white px-4 py-2 shadow">
            {err}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
