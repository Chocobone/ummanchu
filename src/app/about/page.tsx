import Header from "@/components/Header";
import Image from "next/image";
import {prisma} from "@/lib/prisma";

const defaultAbout = {
  heading: "About Us",
  tagline: "Empowering cosmic discovery—one payload at a time.",
  body1: "Since ancient times, ...",
  body2: "Most of the people ...",
  professorName: "Dr. JongHo Seon",
  professorImageUrl: "/images/professor.png",
  highlightTitle: "",
  highlight1: "Recently, the Space Science payload lab ...",
  highlight2: "I hope that life in the space science ...",
  groupPhotoUrl: "/images/group-photo.jpg",
};

export default async function AboutPage() {
  const row = await prisma.aboutContent.findUnique({ where: { page: "about" } });
  const c = row?.data ? { ...defaultAbout, ...(row.data as any) } : defaultAbout;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary-rgb/20">
      <Header />
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <header className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold">{c.heading}</h1>
            <p className="mt-4 text-xl text-foreground-rgb/70"></p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
                {c.tagline}
              </h2>
              <p className="text-lg text-foreground-rgb/70 leading-relaxed">
                {c.body1}
              </p>
            </div>

            <div>
              <Image
                src={c.professorImageUrl}
                alt="SSIL Lab overview"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
              <p className="mt-2 text-sm text-center text-foreground-rgb/70">
                {c.professorName}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-8 mb-16 bg-brand-rgb/15 border border-brand-rgb/20">
            {c.highlightTitle && (
              <h2 className="text-2xl lg:text-3xl font-bold text-brand mb-4">
                {c.highlightTitle}
              </h2>
            )}
            <p className="text-lg leading-relaxed text-foreground mb-6">{c.highlight1}</p>
            <p className="text-lg leading-relaxed text-foreground">{c.highlight2}</p>
          </div>

          <div className="mt-16">
            <Image
              src={c.groupPhotoUrl}
              alt="SSIL 팀 단체사진"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
