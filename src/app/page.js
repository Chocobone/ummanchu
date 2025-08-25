import HeroSection from "@/components/Header";
import CTASection from "@/components/CTASection";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  // Fetch research data on the server
  const allResearch = await prisma.research.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group the data for the CTASection component
  const researchData = {
    Current: allResearch.filter(p => p.status === 'IN_PROGRESS'),
    Completed: allResearch.filter(p => p.status === 'COMPLETED'),
  };

  // Fetch news data on the server
  const newsData = await prisma.news.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
    take: 3, // Limit to 3 news items for the homepage display
  });

  return (
    <>
      <HeroSection />
      <CTASection researchData={researchData} newsData={newsData} />
    </>
  );
}
