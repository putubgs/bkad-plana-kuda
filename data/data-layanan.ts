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

export interface CatatanProgres {
  id: string;
  status: StatusLayanan;
  timestamp: string;
  catatan: string;
  estimasiSelesai?: string;
  keteranganProses?: string;
  tindakLanjutBerikutnya?: string;
  alasanPenolakan?: string;
  dokumenPendukung?: string[];
  diinputOleh: string;
}

export interface LayananMasuk {
  id: string;
  noTiket: string;
  tglMasuk: string;
  durasiLabel: string;
  durasiVariant: DurasiVariant;
  perluTindakLanjut?: boolean;
  namaPemohon: string;
  asalInstansi: string;
  bidangUptb: string[];
  status: StatusLayanan;
  jenisLayanan: string;
  nip: string;
  jabatan: string;
  noWhatsapp: string;
  email: string;
  uraianLayanan: string;
  lampiranPemohon: string[];
  catatanProgres: CatatanProgres[];
}

export const STATUS_FILTERS: { label: string; value: StatusFilterValue }[] = [
  { label: "Semua", value: "Semua" },
  { label: "Diterima", value: "Diterima" },
  { label: "Diverifikasi", value: "Diverifikasi" },
  { label: "Diproses", value: "Diproses" },
  { label: "Selesai", value: "Selesai" },
  { label: "Ditolak", value: "Ditolak" },
];

export const STATUS_ORDER: StatusLayanan[] = [
  "Diterima",
  "Diverifikasi",
  "Diproses",
  "Selesai",
  "Ditolak",
];

export const STATUS_PIPELINE: StatusLayanan[] = [
  "Diterima",
  "Diverifikasi",
  "Diproses",
  "Selesai",
];

export const DATA_LAYANAN_MASUK: LayananMasuk[] = [
  {
    id: "1",
    noTiket: "PK-2026-001",
    tglMasuk: "20 Jul 2026",
    durasiLabel: "Selesai 2 hari",
    durasiVariant: "selesai",
    namaPemohon: "Ahmad Fauzi, S.E.",
    asalInstansi: "Dinas Pendidikan Prov. NTB",
    bidangUptb: ["Bidang Akuntansi dan Pelaporan", "Bidang Anggaran"],
    status: "Selesai",
    jenisLayanan: "Permohonan Informasi",
    nip: "197808152005011003",
    jabatan: "Kepala Subbagian Keuangan",
    noWhatsapp: "08123456789",
    email: "ahmad.fauzi@disdik.ntbprov.go.id",
    uraianLayanan:
      "Memohon informasi terkait laporan keuangan APBD Provinsi NTB tahun anggaran 2025, khususnya realisasi belanja daerah per triwulan.",
    lampiranPemohon: ["Surat_Permohonan_Informasi.pdf", "KTP_Ahmad_Fauzi.jpg"],
    catatanProgres: [
      {
        id: "1-1",
        status: "Diterima",
        timestamp: "2026-07-20 08:15",
        catatan:
          "Permohonan informasi diterima melalui sistem Plana Kuda dan nomor tiket diterbitkan secara otomatis.",
        tindakLanjutBerikutnya:
          "Verifikasi dokumen dan identitas pemohon dari Dinas Pendidikan Prov. NTB.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "1-2",
        status: "Diverifikasi",
        timestamp: "2026-07-20 09:30",
        catatan:
          "Identitas pemohon dan substansi permohonan terverifikasi. Permohonan relevan dan diteruskan ke bidang terkait.",
        tindakLanjutBerikutnya:
          "Meneruskan permohonan ke Bidang Akuntansi dan Pelaporan serta Bidang Anggaran.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "1-3",
        status: "Diproses",
        timestamp: "2026-07-21 10:00",
        catatan:
          "Kedua bidang sedang menyiapkan data dan jawaban atas permohonan informasi yang diajukan.",
        estimasiSelesai: "22 Juli 2026",
        keteranganProses:
          "Penyusunan jawaban dan lampiran realisasi anggaran oleh Bidang Akuntansi dan Pelaporan.",
        tindakLanjutBerikutnya: "Menunggu finalisasi jawaban dari kedua bidang.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "1-4",
        status: "Selesai",
        timestamp: "2026-07-22 14:30",
        catatan:
          "Jawaban telah diterima dari kedua bidang dan disampaikan kepada pemohon melalui email.",
        dokumenPendukung: [
          "Jawaban_Informasi_PK2026001.pdf",
          "Realisasi_Belanja_TW_2025.xlsx",
        ],
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
  {
    id: "2",
    noTiket: "PK-2026-002",
    tglMasuk: "21 Jul 2026",
    durasiLabel: "Berjalan 7 hari",
    durasiVariant: "berjalan-telat",
    perluTindakLanjut: true,
    namaPemohon: "Ir. Baiq Hartini",
    asalInstansi: "RSUD Provinsi NTB",
    bidangUptb: ["Bidang Pengelolaan BMD", "Sekretariat"],
    status: "Diproses",
    jenisLayanan: "Layanan Konsultasi",
    nip: "198203102006042005",
    jabatan: "Kepala Bagian Keuangan",
    noWhatsapp: "08234567890",
    email: "baiq.hartini@rsud.ntbprov.go.id",
    uraianLayanan:
      "Mengajukan konsultasi terkait mekanisme pengelolaan aset BMD rumah sakit dan penyesuaian anggaran belanja modal tahun 2026.",
    lampiranPemohon: ["Surat_Permohonan_Konsultasi.pdf"],
    catatanProgres: [
      {
        id: "2-1",
        status: "Diterima",
        timestamp: "2026-07-21 09:00",
        catatan:
          "Permintaan layanan konsultasi diterima melalui sistem Plana Kuda dan nomor tiket diterbitkan secara otomatis.",
        tindakLanjutBerikutnya:
          "Verifikasi identitas pemohon dan substansi konsultasi dari RSUD Provinsi NTB.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "2-2",
        status: "Diverifikasi",
        timestamp: "2026-07-21 11:00",
        catatan:
          "Identitas pemohon terverifikasi. Substansi konsultasi relevan dan akan dikaji oleh Bidang Pengelolaan BMD.",
        tindakLanjutBerikutnya:
          "Meneruskan permintaan konsultasi ke Bidang Pengelolaan BMD dan Sekretariat.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "2-3",
        status: "Diproses",
        timestamp: "2026-07-22 08:30",
        catatan:
          "Rapat koordinasi antara Bidang Pengelolaan BMD dan Sekretariat dijadwalkan pada 25 Juli 2026 untuk menyiapkan bahan konsultasi.",
        estimasiSelesai: "25 Juli 2026",
        keteranganProses:
          "Rapat koordinasi 25 Juli 2026 pukul 10.00 WITA di Ruang Rapat BKAD Lantai 2.",
        tindakLanjutBerikutnya: "Menunggu konfirmasi Kepala Bidang BMD dan Sekretaris.",
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
  {
    id: "3",
    noTiket: "PK-2026-003",
    tglMasuk: "22 Jul 2026",
    durasiLabel: "Berjalan 6 hari",
    durasiVariant: "berjalan-siaga",
    namaPemohon: "Lalu Moh. Sahnan",
    asalInstansi: "Dinas Pertanian Prov. NTB",
    bidangUptb: ["UPTB Pelayanan Perbendaharaan"],
    status: "Diverifikasi",
    jenisLayanan: "Pengaduan",
    nip: "198507202010011008",
    jabatan: "Staf Keuangan",
    noWhatsapp: "08345678901",
    email: "lalu.sahnan@pertanian.ntbprov.go.id",
    uraianLayanan:
      "Melaporkan keterlambatan pencairan dana bantuan operasional yang menghambat pelaksanaan program penyuluhan pertanian.",
    lampiranPemohon: ["Surat_Pengaduan_003.pdf", "Bukti_Pengajuan_Dana.pdf"],
    catatanProgres: [
      {
        id: "3-1",
        status: "Diterima",
        timestamp: "2026-07-22 10:00",
        catatan:
          "Pengaduan diterima melalui sistem Plana Kuda dan nomor tiket diterbitkan secara otomatis.",
        tindakLanjutBerikutnya:
          "Verifikasi identitas pengadu dan substansi pengaduan dari Dinas Pertanian Prov. NTB.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "3-2",
        status: "Diverifikasi",
        timestamp: "2026-07-22 13:00",
        catatan:
          "Identitas pengadu terverifikasi. Substansi pengaduan relevan dan akan dikaji oleh UPTB Pelayanan Perbendaharaan.",
        tindakLanjutBerikutnya:
          "Meneruskan pengaduan ke UPTB Pelayanan Perbendaharaan untuk penelaahan.",
        dokumenPendukung: ["Nota_Verifikasi_Pengaduan_003.pdf"],
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
  {
    id: "4",
    noTiket: "PK-2026-004",
    tglMasuk: "27 Jul 2026",
    durasiLabel: "Berjalan 1 hari",
    durasiVariant: "berjalan-normal",
    namaPemohon: "Hj. Siti Rahayu, M.M.",
    asalInstansi: "Inspektorat Prov. NTB",
    bidangUptb: ["Bidang Anggaran"],
    status: "Diterima",
    jenisLayanan: "Permohonan Informasi",
    nip: "197911052008012004",
    jabatan: "Auditor Madya",
    noWhatsapp: "08456789012",
    email: "siti.rahayu@inspektorat.ntbprov.go.id",
    uraianLayanan:
      "Memohon salinan dokumen realisasi anggaran Bidang Anggaran untuk keperluan audit internal semester I tahun 2026.",
    lampiranPemohon: ["Surat_Permohonan_Data_Audit.pdf"],
    catatanProgres: [
      {
        id: "4-1",
        status: "Diterima",
        timestamp: "2026-07-27 08:00",
        catatan:
          "Permohonan informasi diterima melalui sistem Plana Kuda dan nomor tiket diterbitkan secara otomatis.",
        tindakLanjutBerikutnya:
          "Verifikasi dokumen dan identitas pemohon dari Inspektorat Prov. NTB.",
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
  {
    id: "5",
    noTiket: "PK-2026-005",
    tglMasuk: "18 Jul 2026",
    durasiLabel: "Selesai 0 hari",
    durasiVariant: "selesai",
    namaPemohon: "Drs. Zulkifli Hakim",
    asalInstansi: "Dinas PU Prov. NTB",
    bidangUptb: ["Bidang BKK"],
    status: "Ditolak",
    jenisLayanan: "Layanan Konsultasi",
    nip: "197001152000031002",
    jabatan: "Kepala Seksi Perencanaan",
    noWhatsapp: "08567890123",
    email: "zulkifli.hakim@pu.ntbprov.go.id",
    uraianLayanan:
      "Menanyakan mekanisme keberatan pajak daerah atas proyek infrastruktur yang sedang berjalan.",
    lampiranPemohon: ["Surat_Permohonan_Konsultasi_Pajak.pdf"],
    catatanProgres: [
      {
        id: "5-1",
        status: "Diterima",
        timestamp: "2026-07-18 09:00",
        catatan:
          "Permintaan layanan konsultasi diterima melalui sistem Plana Kuda dan nomor tiket diterbitkan secara otomatis.",
        tindakLanjutBerikutnya: "Verifikasi kewenangan penanganan permintaan.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "5-2",
        status: "Ditolak",
        timestamp: "2026-07-18 14:00",
        catatan:
          "Permintaan tidak dapat diproses karena bukan merupakan kewenangan BKAD Provinsi NTB.",
        alasanPenolakan:
          "Bukan kewenangan BKAD Provinsi NTB. Pemohon disarankan menghubungi Kantor Wilayah Direktorat Jenderal Pajak Provinsi NTB.",
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
  {
    id: "6",
    noTiket: "PK-2026-006",
    tglMasuk: "28 Jul 2026",
    durasiLabel: "Hari ini",
    durasiVariant: "hari-ini",
    namaPemohon: "Nina Kartika, S.Sos.",
    asalInstansi: "Biro Organisasi Prov. NTB",
    bidangUptb: ["Sekretariat", "UPTB BP2AD"],
    status: "Diterima",
    jenisLayanan: "Pengaduan",
    nip: "199002142015022001",
    jabatan: "Analis Kepegawaian",
    noWhatsapp: "08678901234",
    email: "nina.kartika@biroorganisasi.ntbprov.go.id",
    uraianLayanan:
      "Melaporkan dugaan ketidaksesuaian data kepegawaian pada sistem informasi ASN yang berdampak pada proses mutasi pegawai.",
    lampiranPemohon: [
      "Surat_Pengaduan_Kepegawaian.pdf",
      "Lampiran_Data_ASN.xlsx",
    ],
    catatanProgres: [
      {
        id: "6-1",
        status: "Diterima",
        timestamp: "2026-07-28 08:00",
        catatan:
          "Pengaduan diterima melalui sistem Plana Kuda dan diteruskan ke unit terkait untuk verifikasi awal.",
        tindakLanjutBerikutnya:
          "Verifikasi identitas pelapor dan substansi pengaduan oleh Sekretariat.",
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
  {
    id: "7",
    noTiket: "PK-2026-007",
    tglMasuk: "15 Jul 2026",
    durasiLabel: "Selesai 5 hari",
    durasiVariant: "selesai",
    namaPemohon: "Ir. H. Muh. Ilham, M.T.",
    asalInstansi: "Bappeda Prov. NTB",
    bidangUptb: [
      "Bidang Akuntansi dan Pelaporan",
      "Bidang Pengelolaan BMD",
      "Bidang Anggaran",
    ],
    status: "Selesai",
    jenisLayanan: "Permohonan Informasi",
    nip: "196512201990031001",
    jabatan: "Kepala Bidang Perencanaan",
    noWhatsapp: "08789012345",
    email: "muh.ilham@bappeda.ntbprov.go.id",
    uraianLayanan:
      "Memohon data konsolidasi realisasi belanja tiga bidang untuk bahan penyusunan dokumen perencanaan pembangunan daerah tahun 2027.",
    lampiranPemohon: ["Surat_Permohonan_Data_Bappeda.pdf"],
    catatanProgres: [
      {
        id: "7-1",
        status: "Diterima",
        timestamp: "2026-07-15 08:10",
        catatan:
          "Permohonan informasi diterima melalui sistem Plana Kuda dan nomor tiket diterbitkan secara otomatis.",
        tindakLanjutBerikutnya:
          "Verifikasi dokumen dan identitas pemohon dari Bappeda Prov. NTB.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "7-2",
        status: "Diverifikasi",
        timestamp: "2026-07-16 09:00",
        catatan:
          "Identitas pemohon dan substansi permohonan terverifikasi, diteruskan ke tiga bidang terkait.",
        tindakLanjutBerikutnya:
          "Meneruskan permohonan ke Bidang Akuntansi dan Pelaporan, Bidang Pengelolaan BMD, dan Bidang Anggaran.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "7-3",
        status: "Diproses",
        timestamp: "2026-07-18 10:00",
        catatan:
          "Ketiga bidang sedang menyiapkan data dan jawaban gabungan atas permohonan informasi yang diajukan.",
        estimasiSelesai: "20 Juli 2026",
        keteranganProses:
          "Kompilasi data dari tiga bidang dijadwalkan selesai 20 Juli 2026.",
        tindakLanjutBerikutnya: "Menunggu finalisasi jawaban dari ketiga bidang.",
        diinputOleh: "Pokja Plana Kuda",
      },
      {
        id: "7-4",
        status: "Selesai",
        timestamp: "2026-07-20 15:45",
        catatan:
          "Jawaban permohonan informasi telah difinalisasi dan dikirimkan kepada pemohon melalui email.",
        dokumenPendukung: ["Jawaban_Informasi_PK2026007.pdf"],
        diinputOleh: "Pokja Plana Kuda",
      },
    ],
  },
];
