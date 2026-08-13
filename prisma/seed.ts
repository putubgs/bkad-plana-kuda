import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEED_USERNAME = "planakuda";
const SEED_EMAIL = "planakuda@bkad.ntbprov.go.id";
const SEED_PASSWORD = "PlanaKuda#2026";

async function main() {
  const existing = await prisma.user.findUnique({ where: { username: SEED_USERNAME } });

  if (existing) {
    console.log(`Seed skipped: user "${SEED_USERNAME}" already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);

  await prisma.user.create({
    data: {
      username: SEED_USERNAME,
      email: SEED_EMAIL,
      password: hashedPassword,
      role: "superadmin",
      biography: "Administrator utama Pokja Plana Kuda, BKAD Provinsi NTB.",
      isActive: true,
    },
  });

  console.log("Seed complete. Admin user created:");
  console.log(`  Username: ${SEED_USERNAME}`);
  console.log(`  Email   : ${SEED_EMAIL}`);
  console.log(`  Password: ${SEED_PASSWORD} (change this after first login)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
