'use client';

import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { defaultAbout } from "@/lib/aboutContent";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/PageLayout"; // ✅ 공통 레이아웃 추가

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const { isAdmin } = useAuth();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch("/api/about", { cache: "no-store" });
      const data = await res.json();
      setContent(data);
    };
    fetchAbout();
  }, []);

  if (!content) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </PageLayout>
    );
  }

  const c = content || defaultAbout;

  return (
    <PageLayout>
      <main className="relative pt-10">
        {isAdmin && (
          <div className="absolute top-6 right-6 z-20">
            <Link href="/admin/about">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <header className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {c.heading}
            </h1>
            {c.subheading && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {c.subheading}
              </p>
            )}
          </header>

          {/* 교수 소개 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-primary">
                {c.tagline}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {c.body1}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src={c.professorImageUrl}
                alt="Professor"
                width={450}
                height={450}
                className="rounded-2xl shadow-lg object-cover"
              />
              {c.professorName && (
                <p className="mt-4 text-sm text-muted-foreground font-medium">
                  {c.professorName}
                </p>
              )}
            </div>
          </div>

          {/* 하이라이트 */}
          <div className="rounded-2xl p-10 mb-20 bg-primary/10 border border-primary/20">
            {c.highlightTitle && (
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                {c.highlightTitle}
              </h2>
            )}
            {c.highlight1 && (
              <p className="text-lg leading-relaxed text-foreground mb-6">
                {c.highlight1}
              </p>
            )}
            {c.highlight2 && (
              <p className="text-lg leading-relaxed text-foreground">
                {c.highlight2}
              </p>
            )}
          </div>

          {/* 단체 사진 */}
          {c.groupPhotoUrl && (
            <div className="mb-24">
              <Image
                src={c.groupPhotoUrl}
                alt="SSIL Group"
                width={1200}
                height={800}
                className="w-full rounded-2xl shadow-xl object-cover"
              />
              <p className="mt-3 text-sm text-center text-muted-foreground">
                SSIL Research Group
              </p>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
