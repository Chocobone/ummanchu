import { prisma } from "@/lib/prisma";
import Header from "@/components/Navbar";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

function groupByYear<T extends { year: number }>(items: T[]) {
  const map = new Map<number, T[]>();
  for (const it of items) {
    const arr = map.get(it.year) ?? [];
    arr.push(it);
    map.set(it.year, arr);
  }
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
    <div className="min-h-screen bg-white text-foreground transition-colors dark:bg-neutral-950">
      <div className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-border">
        <Header />
      </div>

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <header className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-foreground">
              Publications
            </h1>
            <p className="text-lg text-muted-foreground">
              Peer-reviewed papers, conference proceedings, and preprints.
            </p>
          </header>

          {byYear.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No publications available yet.
            </p>
          ) : (
            <div className="space-y-16">
              {byYear.map(([year, list]) => (
                <section key={year}>
                  <h2 className="text-3xl font-bold text-primary mb-6 border-b border-border pb-2">
                    {year}
                  </h2>
                  <ul className="space-y-6">
                    {list.map((p) => {
                      const link = p.url || p.pdfUrl;
                      return (
                        <li
                          key={p.id}
                          className="rounded-xl border border-border bg-white dark:bg-neutral-900 hover:border-primary/40 transition p-6 shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold leading-snug text-foreground">
                                {link ? (
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                  >
                                    {p.title}
                                  </a>
                                ) : (
                                  p.title
                                )}
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {p.authors}
                              </p>
                              {(p.venue || p.month) && (
                                <p className="text-sm text-foreground/70 mt-1">
                                  {p.venue}
                                  {p.month
                                    ? ` • ${String(p.month).padStart(2, "0")}/${p.year}`
                                    : ""}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 shrink-0">
                              {p.pdfUrl && (
                                <a
                                  href={p.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-primary/10 transition"
                                >
                                  PDF
                                </a>
                              )}
                              {p.url && (
                                <a
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-primary/10 transition"
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
          )}
        </div>
      </main>
    </div>
  );
}