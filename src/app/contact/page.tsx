export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import PageLayout from "@/components/PageLayout";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export default async function ContactPage() {
  noStore();
  const contact = await prisma.contact.findUnique({ where: { id: 1 } });

  return (
    <PageLayout>
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10 lg:px-16 space-y-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-center text-foreground">
            SSIL Contact
          </h1>

          {contact && (
            <>
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-primary">Laboratory Name</h2>
                  <p className="mt-2 text-lg text-foreground/90">
                    {contact.labNameKo} ({contact.labNameEn})
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-primary">Laboratory Location</h2>
                  <p className="mt-2 text-lg leading-relaxed whitespace-pre-line text-foreground/90">
                    {contact.addressKo}
                    <br />
                    {contact.addressEn}
                  </p>
                </div>
              </div>

              <div className="w-full h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
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
    </PageLayout>
  );
}