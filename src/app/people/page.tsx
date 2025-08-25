// app/people/page.tsx (Server Component)
import prisma from "@/lib/prisma";
import PeopleClientPage from "./PeopleClientPage";
import { Role } from '@prisma/client'; // Import the Role enum

export default async function PeoplePage() {
  // 1. Fetch all people data from the database
  const allPeople = await prisma.person.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  // 2. Group people by their role
  const peopleData = {
    Professor: allPeople.filter(p => p.role === Role.PROFESSOR),
    Current: allPeople.filter(p => p.role === Role.CURRENT),
    Alumni: allPeople.filter(p => p.role === Role.ALUMNI),
  };

  // 3. Render the client component with the fetched data
  return <PeopleClientPage peopleData={peopleData} />;
}
