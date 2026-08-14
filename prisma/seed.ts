import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { DATA_BIDANG_ADMIN } from "../data/data-admin-bidang";
import { DATA_LAYANAN_MASUK } from "../data/data-layanan";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEED_USERNAME = "planakuda";
const SEED_EMAIL = "planakuda@bkad.ntbprov.go.id";
const SEED_PASSWORD = "PlanaKuda#2026";

function clip(value: string | undefined, max = 255) {
  if (!value) return null;
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function parseSeedDate(timestamp: string) {
  return new Date(`${timestamp.replace(" ", "T")}+08:00`);
}

async function ensureAdmin(passwordHash: string) {
  return prisma.user.upsert({
    where: { username: SEED_USERNAME },
    create: {
      username: SEED_USERNAME,
      email: SEED_EMAIL,
      password: passwordHash,
      role: "superadmin",
      biography: "Administrator utama Pokja Plana Kuda, BKAD Provinsi NTB.",
      isActive: true,
    },
    update: {},
  });
}

async function ensureDepartmentUsers(passwordHash: string) {
  for (const bidang of DATA_BIDANG_ADMIN) {
    const username = bidang.email.split("@")[0] ?? `bidang-${bidang.id}`;
    await prisma.user.upsert({
      where: { email: bidang.email },
      create: {
        username,
        email: bidang.email,
        password: passwordHash,
        role: "admin",
        departmentName: bidang.bidangNama,
        biography: bidang.biografi,
        isActive: bidang.status === "Aktif",
      },
      update: {
        departmentName: bidang.bidangNama,
        biography: bidang.biografi,
        isActive: bidang.status === "Aktif",
      },
    });
  }
}

async function ensureTickets(adminUserId: string) {
  for (const item of DATA_LAYANAN_MASUK) {
    const createdAt = parseSeedDate(item.catatanProgres[0]?.timestamp ?? "2026-07-20 08:00");

    await prisma.$transaction(async (tx) => {
      await tx.ticket.upsert({
        where: { ticketNumber: item.noTiket },
        create: {
          ticketNumber: item.noTiket,
          applicantName: item.namaPemohon,
          applicantOccupation: item.jabatan,
          whatsappNumber: item.noWhatsapp.slice(0, 20),
          organizationName: item.asalInstansi,
          identityNumber: item.nip,
          applicantEmail: item.email,
          serviceDescription: item.uraianLayanan,
          isCompleted: item.status === "Selesai",
          createdAt,
        },
        update: {
          applicantName: item.namaPemohon,
          applicantOccupation: item.jabatan,
          whatsappNumber: item.noWhatsapp.slice(0, 20),
          organizationName: item.asalInstansi,
          identityNumber: item.nip,
          applicantEmail: item.email,
          serviceDescription: item.uraianLayanan,
          isCompleted: item.status === "Selesai",
          isDeleted: false,
        },
      });

      await tx.ticketDepartment.deleteMany({ where: { ticketNumber: item.noTiket } });
      if (item.bidangUptb.length > 0) {
        await tx.ticketDepartment.createMany({
          data: item.bidangUptb.map((departmentName) => ({
            ticketNumber: item.noTiket,
            departmentName,
          })),
        });
      }

      await tx.ticketProgress.deleteMany({ where: { ticketNumber: item.noTiket } });
      if (item.catatanProgres.length > 0) {
        await tx.ticketProgress.createMany({
          data: item.catatanProgres.map((entry) => ({
            ticketNumber: item.noTiket,
            progressName: entry.status,
            dateAndTime: parseSeedDate(entry.timestamp),
            progressNote: clip(entry.catatan) ?? entry.status,
            followUpFeedback: clip(entry.tindakLanjutBerikutnya ?? entry.alasanPenolakan),
            processDescription: clip(entry.keteranganProses),
            updatedById: adminUserId,
          })),
        });
      }
    });
  }
}

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);
  const admin = await ensureAdmin(passwordHash);
  await ensureDepartmentUsers(passwordHash);
  await ensureTickets(admin.userId);

  console.log("Seed complete.");
  console.log(`  Admin     : ${SEED_USERNAME} / ${SEED_EMAIL}`);
  console.log(`  Password  : ${SEED_PASSWORD} (change this after first login)`);
  console.log(`  Bidang    : ${DATA_BIDANG_ADMIN.length} department users`);
  console.log(`  Tickets   : ${DATA_LAYANAN_MASUK.length} layanan masuk`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
