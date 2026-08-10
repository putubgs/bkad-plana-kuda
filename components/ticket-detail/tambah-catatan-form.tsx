"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { STATUS_ORDER } from "@/data/data-layanan";
import type { StatusLayanan } from "@/data/data-layanan";
import { useLayananStore } from "@/store/use-layanan-store";

export default function TambahCatatanForm({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: StatusLayanan;
}) {
  const addCatatanProgres = useLayananStore((state) => state.addCatatanProgres);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<StatusLayanan>(currentStatus);
  const [catatan, setCatatan] = useState("");
  const [tindakLanjut, setTindakLanjut] = useState("");
  const [estimasiSelesai, setEstimasiSelesai] = useState("");
  const [keteranganProses, setKeteranganProses] = useState("");
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleFilesChange = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFiles((prev) => [...prev, ...Array.from(fileList).map((file) => file.name)]);
  };

  const handleRemoveFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file !== name));
  };

  const resetForm = () => {
    setCatatan("");
    setTindakLanjut("");
    setEstimasiSelesai("");
    setKeteranganProses("");
    setAlasanPenolakan("");
    setFiles([]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (catatan.trim().length === 0) return;

    addCatatanProgres(ticketId, {
      status,
      catatan: catatan.trim(),
      tindakLanjutBerikutnya: tindakLanjut.trim() || undefined,
      estimasiSelesai: estimasiSelesai.trim() || undefined,
      keteranganProses: keteranganProses.trim() || undefined,
      alasanPenolakan:
        status === "Ditolak" ? alasanPenolakan.trim() || undefined : undefined,
      dokumenPendukung: files.length > 0 ? files : undefined,
    });

    resetForm();
    setJustSubmitted(true);
    window.setTimeout(() => setJustSubmitted(false), 2500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-100"
    >
      <div className="bg-blue-600 px-4 py-3">
        <p className="flex items-center gap-1.5 text-sm font-bold text-white">
          <AddOutlinedIcon fontSize="small" />
          Tambah Catatan Progres
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-white p-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400">
            STATUS <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusLayanan)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            {STATUS_ORDER.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400">
            CATATAN PROGRES <span className="text-red-500">*</span>
          </label>
          <textarea
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            required
            rows={3}
            placeholder="Jelaskan perkembangan penanganan permohonan ini..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400">
            TINDAK LANJUT BERIKUTNYA (OPSIONAL)
          </label>
          <input
            value={tindakLanjut}
            onChange={(event) => setTindakLanjut(event.target.value)}
            placeholder="Langkah selanjutnya yang akan dilakukan..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400">
              ESTIMASI SELESAI (OPSIONAL)
            </label>
            <input
              value={estimasiSelesai}
              onChange={(event) => setEstimasiSelesai(event.target.value)}
              placeholder="Contoh: 25 Juli 2026"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
            />
          </div>

          {status === "Ditolak" ? (
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-red-400">
                ALASAN PENOLAKAN
              </label>
              <input
                value={alasanPenolakan}
                onChange={(event) => setAlasanPenolakan(event.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 outline-none placeholder:text-red-300 focus:border-red-400"
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400">
            KETERANGAN PROSES (OPSIONAL)
          </label>
          <textarea
            value={keteranganProses}
            onChange={(event) => setKeteranganProses(event.target.value)}
            rows={2}
            placeholder="Detail tambahan mengenai proses yang sedang berjalan..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400">
            LAMPIRAN DOKUMEN (OPSIONAL)
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm font-medium text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <AttachFileOutlinedIcon fontSize="small" />
            Klik untuk melampirkan dokumen pendukung
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              handleFilesChange(event.target.files);
              event.target.value = "";
            }}
          />
          {files.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file) => (
                <span
                  key={file}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium whitespace-nowrap text-blue-600"
                >
                  <InsertDriveFileOutlinedIcon sx={{ fontSize: 13 }} />
                  {file}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file)}
                    className="text-blue-400 transition-colors hover:text-blue-600"
                  >
                    <CloseIcon sx={{ fontSize: 13 }} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={catatan.trim().length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AddOutlinedIcon fontSize="small" />
          {justSubmitted ? "Catatan Tersimpan" : "Simpan Catatan Progres"}
        </button>
      </div>
    </form>
  );
}
