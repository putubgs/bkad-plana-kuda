import type { ReactNode } from "react";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DurationSummaryBanner from "@/components/ticket-detail/duration-summary-banner";
import type { LayananMasuk } from "@/data/data-layanan";
import { formatTanggalLengkap } from "@/lib/format-tanggal";

function InfoField({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400">
        {icon}
        {label}
      </p>
      <div className="text-sm font-semibold text-slate-800">{children}</div>
    </div>
  );
}

function PemohonField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-slate-800">{children}</div>
    </div>
  );
}

export default function InfoLayananTab({ ticket }: { ticket: LayananMasuk }) {
  const tglMasukLengkap = ticket.catatanProgres[0]
    ? formatTanggalLengkap(ticket.catatanProgres[0].timestamp)
    : ticket.tglMasuk;

  return (
    <div className="flex flex-col gap-4">
      <DurationSummaryBanner ticket={ticket} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoField icon={<TagOutlinedIcon sx={{ fontSize: 14 }} />} label="NOMOR TIKET">
          {ticket.noTiket}
        </InfoField>

        <InfoField
          icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />}
          label="TANGGAL MASUK"
        >
          {tglMasukLengkap}
        </InfoField>

        <InfoField
          icon={<DescriptionOutlinedIcon sx={{ fontSize: 14 }} />}
          label="JENIS LAYANAN"
        >
          {ticket.jenisLayanan}
        </InfoField>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400">
            <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} />
            BIDANG / UPTB TERKAIT
          </p>
          <span className="rounded-md bg-slate-700 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-white">
            {ticket.bidangUptb.length} unit
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {ticket.bidangUptb.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-600"
            >
              <LocalOfferOutlinedIcon sx={{ fontSize: 12 }} className="text-slate-400" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800">
          <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
          Data Pemohon
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <PemohonField label="NAMA LENGKAP">{ticket.namaPemohon}</PemohonField>
          <PemohonField label="NIP/NIK">{ticket.nip}</PemohonField>
          <PemohonField label="JABATAN/PEKERJAAN">{ticket.jabatan}</PemohonField>
          <PemohonField label="ASAL INSTANSI">{ticket.asalInstansi}</PemohonField>
          <PemohonField label="NO. WHATSAPP">
            <span className="flex items-center gap-1.5">
              <PhoneOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
              {ticket.noWhatsapp}
            </span>
          </PemohonField>
          <PemohonField label="ALAMAT EMAIL">
            <span className="flex items-center gap-1.5">
              <EmailOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
              {ticket.email}
            </span>
          </PemohonField>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <DescriptionOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
          Uraian Layanan
        </p>
        <p className="mt-2 text-sm text-slate-600">{ticket.uraianLayanan}</p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <AttachFileOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
          Lampiran Pemohon ({ticket.lampiranPemohon.length})
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {ticket.lampiranPemohon.map((file) => (
            <span
              key={file}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium whitespace-nowrap text-blue-600"
            >
              <InsertDriveFileOutlinedIcon sx={{ fontSize: 13 }} />
              {file}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
