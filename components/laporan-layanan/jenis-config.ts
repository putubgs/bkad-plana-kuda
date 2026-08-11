export const JENIS_LAYANAN_LIST = [
  "Permohonan Informasi",
  "Layanan Konsultasi",
  "Pengaduan",
] as const;

export const JENIS_LAYANAN_COLOR: Record<string, string> = {
  "Permohonan Informasi": "bg-sky-500",
  "Layanan Konsultasi": "bg-violet-500",
  Pengaduan: "bg-rose-500",
};
