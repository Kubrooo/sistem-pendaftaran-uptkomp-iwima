import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD || "Admin12345!",
    10,
  );

  await prisma.admin.upsert({
    where: { email: process.env.DEFAULT_ADMIN_EMAIL || "admin@iwima.ac.id" },
    update: {},
    create: {
      name: "Administrator",
      email: process.env.DEFAULT_ADMIN_EMAIL || "admin@iwima.ac.id",
      password,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
