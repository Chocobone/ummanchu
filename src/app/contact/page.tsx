// app/contact/page.tsx
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';
import Header from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';
export default async function ContactPage() {
  noStore();
  const contact = await prisma.contact.findUnique({ where: { id: 1 } });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary-rgb/20">
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h1 className="text-5xl font-bold text-center">SSIL Contact</h1>

            {contact && (
              <>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-brand">Labatory Name</h2>
                    <p className="mt-1 text-lg">
                      {contact.labNameKo} ({contact.labNameEn})
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-brand">Labatory Location</h2>
                    <p className="mt-1 text-lg leading-relaxed whitespace-pre-line">
                      {contact.addressKo}
                      <br />
                      {contact.addressEn}
                    </p>
                  </div>
                </div>

                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <iframe
                    src={contact.mapEmbedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
