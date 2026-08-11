import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

type NotFoundReason = "missing" | "not-found" | "not-finished";

const MESSAGES: Record<NotFoundReason, { title: string; description: string }> = {
  missing: {
    title: "Tautan Tidak Lengkap",
    description:
      "Nomor tiket tidak ditemukan pada tautan ini. Silakan gunakan tautan rating yang dikirimkan melalui email setelah layanan Anda selesai diproses.",
  },
  "not-found": {
    title: "Tiket Tidak Ditemukan",
    description: "Nomor tiket pada tautan ini tidak terdaftar dalam sistem kami.",
  },
  "not-finished": {
    title: "Layanan Belum Selesai",
    description:
      "Rating hanya dapat diberikan setelah layanan selesai diproses. Silakan coba lagi setelah tiket Anda berstatus selesai.",
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
