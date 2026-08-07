"use client";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function ExportButton({
  label,
  variant = "outline",
  onClick,
  loading,
}: {
  label: string;
  variant?: "solid" | "outline";
  onClick: () => void;
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const variantStyles =
    variant === "solid"
      ? "bg-[#155DFC] text-white hover:bg-blue-700"
      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variantStyles}`}
    >
      <FileDownloadOutlinedIcon fontSize="small" />
      {loading ? "Mengekspor..." : label}
    </button>
  );
}
