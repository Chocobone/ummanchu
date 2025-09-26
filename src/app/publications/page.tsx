// app/publication/page.tsx
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

function groupByYear<T extends { year: number }>(items: T[]) {
  const map = new Map<number, T[]>();
  for (const it of items) {
    const arr = map.get(it.year) ?? [];
    arr.push(it);
    map.set(it.year, arr);
  }
  // 내림차순 정렬된 [year, items] 배열로 반환
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

export default async function PublicationPage() {
  noStore();

  const pubs = await prisma.publication.findMany({
    orderBy: [
      { year: "desc" },
      { month: "desc" },
      { createdAt: "desc" },
    ],
  });

  const byYear = groupByYear(pubs);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <main className="pt-20 pb-16"> {/* 헤더 fixed라면 pt 조정 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Publications</h1>
              <p className="text-foreground/70 mt-2">
                Peer-reviewed papers, conference proceedings, and preprints.
              </p>
            </header>

            <div className="space-y-12">
              {byYear.length === 0 && (
                <p className="text-muted-foreground">No publications yet.</p>
              )}

              {byYear.map(([year, list]) => (
                <section key={year}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{year}</h2>
                  <ul className="space-y-4">
                    {list.map((p) => {
                      const primaryLink = p.url || p.pdfUrl;
                      return (
                        <li
                          key={p.id}
                          className="rounded-lg bg-background/10 hover:bg-background/20 transition p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {primaryLink ? (
                                  <a
                                    href={primaryLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {p.title}
                                  </a>
                                ) : (
                                  p.title
                                )}
                              </h3>
                              <p className="text-foreground/80 mt-1">{p.authors}</p>
                              {(p.venue || p.month) && (
                                <p className="text-muted-foreground text-sm mt-1">
                                  {p.venue}
                                  {p.month ? ` • ${String(p.month).padStart(2, "0")}/${p.year}` : ""}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 mt-3 md:mt-0">
                              {p.pdfUrl && (
                                <a
                                  href={p.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-background/30"
                                >
                                  PDF
                                </a>
                              )}
                              {p.url && (
                                <a
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-background/30"
                                >
                                  Link
                                </a>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
