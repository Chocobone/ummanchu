import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("AdminPass123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@yourlab.edu" },
    update: {},
    create: {
      email: "admin@yourlab.edu",
      password: hash,
      role: "admin",
    },
  });
  console.log("✅ admin user created");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());