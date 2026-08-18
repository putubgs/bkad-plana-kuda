"use client";

import { useState, type FormEvent } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";

const BIDANG_OPTIONS = [
  "Bidang Anggaran",
  "Bidang Pengelolaan BMD",
  "Bidang Akuntansi dan Pelaporan",
  "Bidang BKK",
  "UPTB Pelayanan Perbendaharaan",
  "UPTB BP2AD",
  "Sekretariat",
] as const;

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#155DFC] text-[11px] font-bold text-white">
        {number}
      </span>
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <span className="text-xs font-semibold text-slate-700">
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </span>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#155DFC]";

export default function KonsultasiForm() {
  const [applicantName, setApplicantName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [applicantOccupation, setApplicantOccupation] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [supportFiles, setSupportFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  function toggleDepartment(name: string) {
    setDepartmentNames((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (departmentNames.length === 0) {
      setError("Pilih minimal satu bidang/UPTB.");
      return;
    }

    if (!ktpFile) {
      setError("Scan/foto KTP wajib dilampirkan.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await postJson<ApiResult>("/api/v1/tickets/public", {
        applicantName,
        identityNumber,
        applicantOccupation: applicantOccupation || undefined,
        organizationName,
        whatsappNumber,
        applicantEmail,
        departmentNames,
        topic,
        serviceDescription,
      });

      if (result.error || !result.success) {
        const details = Object.values(result.fieldErrors ?? {})
          .flatMap((messages) => messages ?? [])
          .filter(Boolean)
          .join(" ");
        setError([result.error, details].filter(Boolean).join(" ") || "Pengiriman gagal. Silakan coba lagi.");
        return;
      }

      const data = result.data as { noTiket?: string } | undefined;
      setTicketNumber(data?.noTiket ?? null);
    } catch {
      setError("Tidak dapat terhubung ke server. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (ticketNumber) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircleOutlinedIcon sx={{ fontSize: 26 }} />
        </span>
        <p className="mt-3 text-sm font-bold text-slate-900">Permohonan berhasil dikirim</p>
        <p className="mt-1 text-xs text-slate-500">
          Nomor tiket Anda{" "}
          <span className="font-semibold text-[#155DFC]">{ticketNumber}</span>. Status saat ini{" "}
          <span className="font-semibold">Diterima</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-base font-bold text-slate-900">Layanan Konsultasi</p>
        <p className="mt-1 text-xs text-slate-500">
          Isi formulir berikut untuk mengajukan konsultasi kepada BKAD Provinsi NTB.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle number={1} title="Identitas Pemohon" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col">
            <FieldLabel required>Nama Lengkap</FieldLabel>
            <input
              required
              value={applicantName}
              onChange={(event) => setApplicantName(event.target.value)}
              placeholder="Masukkan nama lengkap"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col">
            <FieldLabel required>NIP / NIK</FieldLabel>
            <input
              required
              value={identityNumber}
              onChange={(event) => setIdentityNumber(event.target.value)}
              placeholder="Masukkan NIP atau NIK"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col">
            <FieldLabel>Jabatan / Pekerjaan</FieldLabel>
            <input
              value={applicantOccupation}
              onChange={(event) => setApplicantOccupation(event.target.value)}
              placeholder="Jabatan atau pekerjaan Anda"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col">
            <FieldLabel required>Asal Instansi / Organisasi</FieldLabel>
            <input
              required
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              placeholder="Instansi atau organisasi asal"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle number={2} title="Informasi Kontak" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col">
            <FieldLabel required>No. WhatsApp</FieldLabel>
            <input
              required
              inputMode="numeric"
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="Contoh: 08xxxxxxxxxx"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col">
            <FieldLabel required>Alamat Email</FieldLabel>
            <input
              required
              type="email"
              value={applicantEmail}
              onChange={(event) => setApplicantEmail(event.target.value)}
              placeholder="Alamat email aktif Anda"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle number={3} title="Substansi Konsultasi" />
        <div className="mt-4 flex flex-col gap-4">
          <fieldset>
            <FieldLabel required>Bidang / UPTB Terkait</FieldLabel>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {BIDANG_OPTIONS.map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={departmentNames.includes(name)}
                    onChange={() => toggleDepartment(name)}
                    className="h-4 w-4 accent-[#155DFC]"
                  />
                  {name}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col">
            <FieldLabel required>Topik Konsultasi</FieldLabel>
            <input
              required
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Ringkasan topik konsultasi Anda"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col">
            <FieldLabel required>Uraian Konsultasi</FieldLabel>
            <textarea
              required
              rows={5}
              value={serviceDescription}
              onChange={(event) => setServiceDescription(event.target.value)}
              placeholder="Uraikan permasalahan atau pertanyaan konsultasi Anda secara detail..."
              className={`${inputClass} resize-y`}
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle number={4} title="Lampiran" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <CloudUploadOutlinedIcon className="mx-auto text-slate-400" />
            <FieldLabel required>Scan / Foto KTP</FieldLabel>
            <p className="mt-1 text-[11px] text-slate-400">JPG, PNG, atau PDF. Maks. 2 MB.</p>
            <p className="mt-2 text-xs font-medium text-[#155DFC]">
              {ktpFile ? ktpFile.name : "Pilih berkas"}
            </p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(event) => setKtpFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <label className="flex cursor-pointer flex-col rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <CloudUploadOutlinedIcon className="mx-auto text-slate-400" />
            <FieldLabel>Dokumen Pendukung</FieldLabel>
            <p className="mt-1 text-[11px] text-slate-400">PDF, DOC, JPG, PNG. Maks. 5 MB.</p>
            <p className="mt-2 text-xs font-medium text-[#155DFC]">
              {supportFiles.length > 0
                ? `${supportFiles.length} berkas dipilih`
                : "Pilih berkas (opsional)"}
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(event) => setSupportFiles(Array.from(event.target.files ?? []))}
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-relaxed text-slate-400">
          Dengan mengirim formulir ini, Anda menyatakan data yang diisi adalah benar dan akan
          digunakan untuk keperluan layanan BKAD NTB.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-[#155DFC] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1248c9] disabled:opacity-60"
        >
          {submitting ? "Mengirim..." : "Kirim Layanan Konsultasi"}
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </form>
  );
}
