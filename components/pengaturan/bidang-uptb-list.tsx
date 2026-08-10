"use client";

import { useMemo, useState } from "react";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DATA_BIDANG_ADMIN, type BidangAdmin } from "@/data/data-admin-bidang";
import BidangRow from "@/components/pengaturan/bidang-row";
import AdminRatingModal from "@/components/pengaturan/admin-rating-modal";
import TambahAdminForm, { type NewAdminInput } from "@/components/pengaturan/tambah-admin-form";

interface AdminFormValues {
  bidangNama: string;
  email: string;
  biografi: string;
}

export default function BidangUptbList() {
  const [bidangList, setBidangList] = useState<BidangAdmin[]>(DATA_BIDANG_ADMIN);
  const [ratingModalId, setRatingModalId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const aktifCount = useMemo(
    () => bidangList.filter((item) => item.status === "Aktif").length,
    [bidangList]
  );

  const ratingModalBidang = bidangList.find((item) => item.id === ratingModalId) ?? null;

  function handleToggleStatus(id: string) {
    setBidangList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : item
      )
    );
  }

  function handleUpdateAdmin(id: string, values: AdminFormValues) {
    setBidangList((prev) => prev.map((item) => (item.id === id ? { ...item, ...values } : item)));
  }

  function handleDeleteAdmin(id: string) {
    setBidangList((prev) => prev.filter((item) => item.id !== id));
    setRatingModalId((prev) => (prev === id ? null : prev));
  }

  function handleAddAdmin(values: NewAdminInput) {
    const newAdmin: BidangAdmin = {
      id: `bidang-${Date.now()}`,
      bidangNama: values.bidangNama,
      email: values.email,
      biografi: values.biografi,
      status: "Aktif",
      ratedTickets: [],
    };
    setBidangList((prev) => [...prev, newAdmin]);
    setShowAddForm(false);
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2">
          <Groups2OutlinedIcon fontSize="small" className="text-slate-400" />
          <div>
            <p className="text-sm font-bold text-slate-900">Daftar Bidang / UPTB Aktif</p>
            <p className="text-xs text-slate-400">
              Kelola admin, rating layanan, dan status tiap bidang/UPTB
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-slate-700 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white">
            {aktifCount}/{bidangList.length} aktif
          </span>
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              showAddForm
                ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <AddOutlinedIcon sx={{ fontSize: 15 }} />
            {showAddForm ? "Batal" : "Tambah Admin"}
          </button>
        </div>
      </div>

      {showAddForm ? (
        <TambahAdminForm onAdd={handleAddAdmin} onCancel={() => setShowAddForm(false)} />
      ) : null}

      <div>
        {bidangList.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Belum ada admin bidang/UPTB.
          </p>
        ) : (
          bidangList.map((bidang, index) => (
            <BidangRow
              key={bidang.id}
              index={index + 1}
              bidang={bidang}
              onToggleStatus={() => handleToggleStatus(bidang.id)}
              onUpdateAdmin={(values) => handleUpdateAdmin(bidang.id, values)}
              onDeleteAdmin={() => handleDeleteAdmin(bidang.id)}
              onOpenRatings={() => setRatingModalId(bidang.id)}
            />
          ))
        )}
      </div>

      {ratingModalBidang ? (
        <AdminRatingModal bidang={ratingModalBidang} onClose={() => setRatingModalId(null)} />
      ) : null}
    </div>
  );
}
