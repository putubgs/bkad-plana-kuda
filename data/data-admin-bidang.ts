export type StatusAdmin = "Aktif" | "Nonaktif";

export interface TicketRating {
  id: string;
  noTiket: string;
  namaPemohon: string;
  rating: number;
  komentar?: string;
  tanggal: string;
}

export interface BidangAdmin {
  id: string;
  bidangNama: string;
  status: StatusAdmin;
  email: string;
  biografi: string;
  ratedTickets: TicketRating[];
}

const SAMPLE_NAMES = [
  "Rina Wijayanti",
  "Agus Setiawan",
  "I Wayan Sudarsana",
  "Nur Aini",
  "I Made Wirata",
  "Yuni Kristiani",
  "Sri Wahyuni",
  "Bambang Hermawan",
  "Dian Puspita",
  "I Made Arya",
  "Ni Luh Astini",
  "Hendra Gunawan",
  "Ni Ketut Suarni",
  "Yusuf Ramadhan",
  "Farah Diba",
  "Siti Aminah",
  "Budi Santoso",
  "Kadek Ayu Pradnya",
  "Fahmi Ridwan",
  "Lestari Handayani",
  "Made Suastika",
  "Wulan Sari",
  "Arif Rahman",
  "Komang Trisna",
  "Putu Eka Wardani",
];

const SAMPLE_COMMENTS = [
  "Respon cepat dan ramah.",
  "Prosesnya jelas dan mudah dipahami.",
  "Sangat membantu, terima kasih.",
  "Pelayanan memuaskan.",
  "Cukup baik, meski sedikit lama.",
  "Informasi yang diberikan lengkap.",
  "Admin sangat komunikatif.",
  "Proses administrasinya cepat.",
  "Sangat profesional dalam menjawab.",
  "Perlu sedikit peningkatan kecepatan respon.",
  "Semua pertanyaan terjawab dengan baik.",
  "Pengalaman yang menyenangkan.",
];

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
];

const RATING_PATTERN = [5, 4, 5, 5, 4, 5, 3, 5, 4, 5, 5, 4, 5, 4];

function buildRatedTickets(bidangId: string, ticketStart: number, count: number): TicketRating[] {
  const seed = Number(bidangId);
  const entries: TicketRating[] = [];

  for (let i = 0; i < count; i += 1) {
    const namaPemohon = SAMPLE_NAMES[(seed * 3 + i) % SAMPLE_NAMES.length];
    const komentar = SAMPLE_COMMENTS[(seed * 5 + i) % SAMPLE_COMMENTS.length];
    const rating = RATING_PATTERN[(seed + i) % RATING_PATTERN.length];
    const noTiket = `PK-2026-${String(ticketStart + i).padStart(3, "0")}`;
    const monthIndex = Math.min(i, MONTH_NAMES.length - 1);
    const day = 3 + ((i * 7) % 25);

    entries.push({
      id: `${bidangId}-r${i + 1}`,
      noTiket,
      namaPemohon,
      rating,
      komentar,
      tanggal: `${day} ${MONTH_NAMES[monthIndex]} 2026`,
    });
  }

  return entries;
}

export const DATA_BIDANG_ADMIN: BidangAdmin[] = [
  {
    id: "1",
    bidangNama: "Sekretariat",
    status: "Aktif",
    email: "sekretariat.admin@bkad.ntbprov.go.id",
    biografi:
      "Mengelola administrasi umum, kepegawaian, dan kearsipan Pokja Plana Kuda.",
    ratedTickets: buildRatedTickets("1", 40, 12),
  },
  {
    id: "2",
    bidangNama: "Bidang Anggaran",
    status: "Aktif",
    email: "anggaran.admin@bkad.ntbprov.go.id",
    biografi:
      "Bertanggung jawab atas penyusunan dan pengendalian anggaran belanja daerah.",
    ratedTickets: buildRatedTickets("2", 60, 13),
  },
  {
    id: "3",
    bidangNama: "Bidang Akuntansi dan Pelaporan",
    status: "Aktif",
    email: "akuntansi.admin@bkad.ntbprov.go.id",
    biografi: "Menangani pelaporan keuangan dan realisasi belanja daerah.",
    ratedTickets: buildRatedTickets("3", 80, 12),
  },
  {
    id: "4",
    bidangNama: "Bidang Pengelolaan BMD",
    status: "Aktif",
    email: "bmd.admin@bkad.ntbprov.go.id",
    biografi: "Mengelola inventarisasi dan penatausahaan barang milik daerah.",
    ratedTickets: buildRatedTickets("4", 100, 11),
  },
  {
    id: "5",
    bidangNama: "Bidang BKK",
    status: "Nonaktif",
    email: "bkk.admin@bkad.ntbprov.go.id",
    biografi: "Membina pengelolaan keuangan kabupaten/kota se-Provinsi NTB.",
    ratedTickets: buildRatedTickets("5", 120, 10),
  },
  {
    id: "6",
    bidangNama: "UPTB Pelayanan Perbendaharaan",
    status: "Aktif",
    email: "perbendaharaan.admin@bkad.ntbprov.go.id",
    biografi: "Melayani pencairan dan verifikasi SP2D di lingkup UPTB Perbendaharaan.",
    ratedTickets: buildRatedTickets("6", 140, 12),
  },
  {
    id: "7",
    bidangNama: "UPTB BP2AD",
    status: "Aktif",
    email: "bp2ad.admin@bkad.ntbprov.go.id",
    biografi: "Mengelola pendapatan dan optimalisasi aset daerah Provinsi NTB.",
    ratedTickets: buildRatedTickets("7", 160, 12),
  },
];
