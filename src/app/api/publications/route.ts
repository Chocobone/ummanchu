import { prisma } from '@/lib/prisma';

export async function GET() {
  const pubs = await prisma.publication.findMany({ orderBy: [{ year: 'desc' }, { month: 'desc' }] });
  return Response.json(pubs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.publication.create({ data });
  return Response.json(created, { status: 201 });
}
