export type StatusLayanan =
  | "Diterima"
  | "Diverifikasi"
  | "Diproses"
  | "Selesai"
  | "Ditolak";

export type StatusFilterValue = StatusLayanan | "Semua";

export type DurasiVariant =
  | "selesai"
  | "berjalan-normal"
  | "berjalan-siaga"
  | "berjalan-telat"
  | "hari-ini";

export interface LayananMasuk {
  id: string;
  noTiket: string;
  tglMasuk: string;
  durasiLabel: string;
  durasiVariant: DurasiVariant;
  perluTindakLanjut?: boolean;
  namaPemohon: string;
  jenisLayanan: string;
  asalInstansi: string;
  bidangUptb: string[];
  status: StatusLayanan;
}

export const STATUS_FILTERS: { label: string; value: StatusFilterValue }[] = [
  { label: "Semua", value: "Semua" },
  { label: "Diterima", value: "Diterima" },
  { label: "Diverifikasi", value: "Diverifikasi" },
  { label: "Diproses", value: "Diproses" },
  { label: "Selesai", value: "Selesai" },
  { label: "Ditolak", value: "Ditolak" },
];

export const DATA_LAYANAN_MASUK: LayananMasuk[] = [
  {
    id: "1",
    noTiket: "PK-2026-001",
    tglMasuk: "20 Jul 2026",
    durasiLabel: "Selesai 2 hari",
    durasiVariant: "selesai",
    namaPemohon: "Ahmad Fauzi, S.E.",
    jenisLayanan: "Permohonan Informasi",
    asalInstansi: "Dinas Pendidikan Prov. NTB",
    bidangUptb: ["Bidang Akuntansi dan Pelaporan", "Bidang Anggaran"],
    status: "Selesai",
  },
  {
    id: "2",
    noTiket: "PK-2026-002",
    tglMasuk: "21 Jul 2026",
    durasiLabel: "Berjalan 7 hari",
    durasiVariant: "berjalan-telat",
    perluTindakLanjut: true,
    namaPemohon: "Ir. Baiq Hartini",
    jenisLayanan: "Layanan Konsultasi",
    asalInstansi: "RSUD Provinsi NTB",
    bidangUptb: ["Bidang Pengelolaan BMD", "Sekretariat"],
    status: "Diproses",
  },
  {
    id: "3",
    noTiket: "PK-2026-003",
    tglMasuk: "22 Jul 2026",
    durasiLabel: "Berjalan 6 hari",
    durasiVariant: "berjalan-siaga",
    namaPemohon: "Lalu Moh. Sahnan",
    jenisLayanan: "Pengaduan",
    asalInstansi: "Dinas Pertanian Prov. NTB",
    bidangUptb: ["UPTB Pelayanan Perbendaharaan"],
    status: "Diverifikasi",
  },
  {
    id: "4",
    noTiket: "PK-2026-004",
    tglMasuk: "27 Jul 2026",
    durasiLabel: "Berjalan 1 hari",
    durasiVariant: "berjalan-normal",
    namaPemohon: "Hj. Siti Rahayu, M.M.",
    jenisLayanan: "Permohonan Informasi",
    asalInstansi: "Inspektorat Prov. NTB",
    bidangUptb: ["Bidang Anggaran"],
    status: "Diterima",
  },
  {
    id: "5",
    noTiket: "PK-2026-005",
    tglMasuk: "18 Jul 2026",
    durasiLabel: "Selesai 0 hari",
    durasiVariant: "selesai",
    namaPemohon: "Drs. Zulkifli Hakim",
    jenisLayanan: "Layanan Konsultasi",
    asalInstansi: "Dinas PU Prov. NTB",
    bidangUptb: ["Bidang BKK"],
    status: "Ditolak",
  },
  {
    id: "6",
    noTiket: "PK-2026-006",
    tglMasuk: "28 Jul 2026",
    durasiLabel: "Hari ini",
    durasiVariant: "hari-ini",
    namaPemohon: "Nina Kartika, S.Sos.",
    jenisLayanan: "Pengaduan",
    asalInstansi: "Biro Organisasi Prov. NTB",
    bidangUptb: ["Sekretariat", "UPTB BP2AD"],
    status: "Diterima",
  },
  {
    id: "7",
    noTiket: "PK-2026-007",
    tglMasuk: "15 Jul 2026",
    durasiLabel: "Selesai 5 hari",
    durasiVariant: "selesai",
    namaPemohon: "Ir. H. Muh. Ilham, M.T.",
    jenisLayanan: "Permohonan Informasi",
    asalInstansi: "Bappeda Prov. NTB",
    bidangUptb: [
      "Bidang Akuntansi dan Pelaporan",
      "Bidang Pengelolaan BMD",
      "Bidang Anggaran",
    ],
    status: "Selesai",
  },
];
