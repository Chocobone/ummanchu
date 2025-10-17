import HeroSection from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';
import Footer from "@/components/Footer";
export default async function HomePage() {
  noStore();
  // Fetch research data
  const allResearch = await prisma.research.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const researchData = {
    Current: allResearch.filter(p => p.status === 'IN_PROGRESS'),
    Completed: allResearch.filter(p => p.status === 'COMPLETED'),
  };

  // Fetch news data
  const newsData = await prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  // Fetch home page content
  const homeContent = await prisma.homePageContent.findUnique({
    where: { id: 1 },
  });

  // Fetch slider images
  const sliderImages = await prisma.sliderImage.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <>
      <HeroSection />
      <CTASection
        researchData={researchData}
        newsData={newsData}
        homeContent={homeContent}
        sliderImages={sliderImages}
      />
      <Footer />
    </>
  );
}
