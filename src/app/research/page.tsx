import { prisma } from '@/lib/prisma'
import ResearchClientPage from './ResearchClientPage';

export default async function ResearchPage() {
  // Fetch data from the database on the server
  const allResearch = await prisma.research.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group the data into the structure the client component expects
  const researchData = {
    Current: allResearch.filter(p => p.status === 'IN_PROGRESS'),
    Completed: allResearch.filter(p => p.status === 'COMPLETED'),
  };

  // Render the client component with the fetched data
  return <ResearchClientPage researchData={researchData} />;
}
