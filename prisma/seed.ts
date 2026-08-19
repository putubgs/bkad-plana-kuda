import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { DATA_BIDANG_ADMIN } from "../data/data-admin-bidang";
import { DATA_LAYANAN_MASUK } from "../data/data-layanan";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEED_SUPERADMIN_USERNAME = "planakuda";
const SEED_SUPERADMIN_EMAIL = "planakuda@bkad.ntbprov.go.id";
const SEED_SUPERADMIN_PASSWORD = "PlanaKuda#2026";
const SEED_ADMIN_PASSWORD = "AdminBidang#2026";

function clip(value: string | undefined, max = 255) {
  if (!value) return null;
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function parseSeedDate(timestamp: string) {
  return new Date(`${timestamp.replace(" ", "T")}+08:00`);
}

function usernameFromEmail(email: string, fallback: string) {
  return email.split("@")[0] || fallback;
}

async function ensureSuperadmin(passwordHash: string) {
  return prisma.user.upsert({
    where: { username: SEED_SUPERADMIN_USERNAME },
    create: {
      username: SEED_SUPERADMIN_USERNAME,
      email: SEED_SUPERADMIN_EMAIL,
      password: passwordHash,
      role: "superadmin",
      departmentName: null,
      biography: "Administrator utama Pokja Plana Kuda, BKAD Provinsi NTB.",
      isActive: true,
      isDeleted: false,
    },
    update: {
      email: SEED_SUPERADMIN_EMAIL,
      password: passwordHash,
      role: "superadmin",
      departmentName: null,
      biography: "Administrator utama Pokja Plana Kuda, BKAD Provinsi NTB.",
      isActive: true,
      isDeleted: false,
    },
  });
}

async function ensureDepartmentAdmins(passwordHash: string) {
  const departmentUserIds = new Map<string, string>();

  for (const bidang of DATA_BIDANG_ADMIN) {
    const username = usernameFromEmail(bidang.email, `bidang-${bidang.id}`);
    const user = await prisma.user.upsert({
      where: { email: bidang.email },
      create: {
        username,
        email: bidang.email,
        password: passwordHash,
        role: "admin",
        departmentName: bidang.bidangNama,
        biography: bidang.biografi,
        isActive: bidang.status === "Aktif",
        isDeleted: false,
      },
      update: {
        username,
        password: passwordHash,
        role: "admin",
        departmentName: bidang.bidangNama,
        biography: bidang.biografi,
        isActive: bidang.status === "Aktif",
        isDeleted: false,
      },
    });

    departmentUserIds.set(bidang.bidangNama, user.userId);
  }

  return departmentUserIds;
}

function progressActorId(
  status: string,
  departmentNames: string[],
  departmentUserIds: Map<string, string>,
  superadminId: string
) {
  if (status === "Diterima") {
    return superadminId;
  }

  for (const departmentName of departmentNames) {
    const userId = departmentUserIds.get(departmentName);
    if (userId) return userId;
  }

  return superadminId;
}

async function ensureTickets(
  superadminId: string,
  departmentUserIds: Map<string, string>
) {
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
            updatedById: progressActorId(
              entry.status,
              item.bidangUptb,
              departmentUserIds,
              superadminId
            ),
          })),
        });
      }
    });
  }
}

async function main() {
  const [superadminPasswordHash, adminPasswordHash] = await Promise.all([
    bcrypt.hash(SEED_SUPERADMIN_PASSWORD, 12),
    bcrypt.hash(SEED_ADMIN_PASSWORD, 12),
  ]);

  const superadmin = await ensureSuperadmin(superadminPasswordHash);
  const departmentUserIds = await ensureDepartmentAdmins(adminPasswordHash);
  await ensureTickets(superadmin.userId, departmentUserIds);

  console.log("Seed complete.");
  console.log("");
  console.log("Superadmin");
  console.log(`  Username : ${SEED_SUPERADMIN_USERNAME}`);
  console.log(`  Email    : ${SEED_SUPERADMIN_EMAIL}`);
  console.log(`  Password : ${SEED_SUPERADMIN_PASSWORD}`);
  console.log("");
  console.log("Admin bidang/UPTB");
  console.log(`  Password : ${SEED_ADMIN_PASSWORD}`);
  for (const bidang of DATA_BIDANG_ADMIN) {
    const username = usernameFromEmail(bidang.email, `bidang-${bidang.id}`);
    console.log(
      `  - ${username} / ${bidang.email} (${bidang.bidangNama}, ${bidang.status})`
    );
  }
  console.log("");
  console.log(`Tickets : ${DATA_LAYANAN_MASUK.length} layanan masuk`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
