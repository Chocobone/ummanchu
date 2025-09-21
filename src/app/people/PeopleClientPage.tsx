'use client';

import Header from "@/components/Header";
import React, { useState } from "react";
import Image from "next/image";
import { Person } from '@prisma/client';
export const dynamic = 'force-dynamic';
// Define the props for the client page
interface PeopleClientPageProps {
  peopleData: {
    Professor: Person[];
    Current: Person[];
    Alumni: Person[];
  };
}

export default function PeopleClientPage({ peopleData }: PeopleClientPageProps) {
  const tabs = ["Professor", "Current", "Alumni"] as const;
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const profiles = peopleData[selectedTab] || [];

  // Helper function to format optional fields
  const F = (v?: string | null) => (v && v.trim() ? v.trim() : "--");

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <header className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                People
              </h1>
            </header>

            {/* 4-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* 1) Sidebar nav */}
              <nav className="space-y-4 col-span-1">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTab(t)}
                    className={`w-full text-left py-2 px-4 rounded transition ${
                      selectedTab === t
                        ? "bg-primary/20 text-primary font-semibold"
                        : "bg-background/10 text-foreground/70 hover:bg-background/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </nav>

              {/* 2) 중앙 칸: profiles 리스트 (col-span-2) */}
              <div className="col-span-2 space-y-10 overflow-y-auto">
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <section
                      key={profile.id}
                      className="flex flex-col lg:flex-row items-start gap-6"
                    >
                      {/* 이미지 */}
                      <div className="flex-shrink-0 self-center lg:self-start">
                        <Image
                          src={profile.image || "/images/main2.jpg"}
                          alt={profile.name}
                          width={160}
                          height={160}
                          className="w-40 h-40 rounded-lg object-cover bg-muted block lg:hidden"
                        />
                        <Image
                          src={profile.image || "/images/main2.jpg"}
                          alt={profile.name}
                          width={192}
                          height={192}
                          className="w-48 h-48 rounded-lg object-cover bg-muted hidden lg:block"
                        />
                      </div>

                      {/* 텍스트 */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                            {profile.name}
                          </h2>
                          <p className="text-muted-foreground italic">
                            {F(profile.position)}
                          </p>
                        </div>

                        <div className="bg-card rounded-lg p-4 text-foreground">
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                              <dt className="text-sm text-muted-foreground">Email</dt>
                              <dd className="font-medium">
                                {F(profile.email)}
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-sm text-muted-foreground">Degree</dt>
                              <dd className="font-medium whitespace-pre-line">
                                {F(profile.degree)}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="bg-card/80 p-4 rounded-lg text-foreground">
                          <h3 className="text-sm text-muted-foreground mb-1">
                            Description
                          </h3>
                          <p className="whitespace-pre-line leading-relaxed">
                                  {(profile.description)}
                             </p>
                        </div>
                      </div>
                    </section>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No members in this category.
                  </p>
                )}
              </div>

              {/* 3) 우측 여유 공간 */}
              <div className="col-span-1" />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}