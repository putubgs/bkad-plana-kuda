import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

type NotFoundReason = "missing" | "not-found" | "not-finished" | "expired" | "used";

const MESSAGES: Record<NotFoundReason, { title: string; description: string }> = {
  missing: {
    title: "Tautan Tidak Lengkap",
    description:
      "Tautan rating ini tidak lengkap. Silakan gunakan tautan yang dikirimkan setelah layanan Anda selesai diproses.",
  },
  "not-found": {
    title: "Tautan Tidak Valid",
    description: "Tautan rating ini tidak terdaftar atau sudah tidak berlaku.",
  },
  "not-finished": {
    title: "Layanan Belum Selesai",
    description:
      "Rating hanya dapat diberikan setelah layanan selesai diproses. Silakan coba lagi setelah tiket Anda berstatus selesai.",
  },
  expired: {
    title: "Tautan Kedaluwarsa",
    description:
      "Tautan rating ini sudah kedaluwarsa. Hubungi petugas layanan untuk mendapatkan tautan baru.",
  },
  used: {
    title: "Tautan Sudah Digunakan",
    description:
      "Rating untuk tautan ini sudah dikirimkan. Tautan tidak dapat digunakan lagi.",
  },
};

export default function RatingNotFound({
  reason,
  noTiket,
}: {
  reason: NotFoundReason;
  noTiket?: string;
}) {
  const { title, description } = MESSAGES[reason];

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 26 }} />
      </span>
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="max-w-sm text-xs text-slate-500">{description}</p>
      {noTiket ? (
        <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Nomor Tiket: {noTiket}
        </p>
      ) : null}
    </div>
  );
}
