"use client";

import { useEffect, useMemo, useState } from "react";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useAdminBidangStore } from "@/store/use-admin-bidang-store";
import BidangRow from "@/components/pengaturan/bidang-row";
import AdminRatingModal from "@/components/pengaturan/admin-rating-modal";
import TambahAdminForm from "@/components/pengaturan/tambah-admin-form";

export default function BidangUptbList() {
  const bidangList = useAdminBidangStore((state) => state.bidangList);
  const loading = useAdminBidangStore((state) => state.loading);
  const error = useAdminBidangStore((state) => state.error);
  const fetchAdmins = useAdminBidangStore((state) => state.fetchAdmins);
  const toggleStatus = useAdminBidangStore((state) => state.toggleStatus);
  const updateAdmin = useAdminBidangStore((state) => state.updateAdmin);
  const deleteAdmin = useAdminBidangStore((state) => state.deleteAdmin);
  const addAdmin = useAdminBidangStore((state) => state.addAdmin);

  const [ratingModalId, setRatingModalId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    void fetchAdmins();
  }, [fetchAdmins]);

  const aktifCount = useMemo(
    () => bidangList.filter((item) => item.status === "Aktif").length,
    [bidangList]
  );

  const ratingModalBidang = bidangList.find((item) => item.id === ratingModalId) ?? null;

  function handleDeleteAdmin(id: string) {
    void deleteAdmin(id);
    setRatingModalId((prev) => (prev === id ? null : prev));
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
        <TambahAdminForm
          onAdd={async (values) => {
            const errorMessage = await addAdmin(values);
            if (!errorMessage) {
              setShowAddForm(false);
            }
          }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : null}

      {error ? (
        <p className="border-t border-slate-100 px-5 py-3 text-xs font-medium text-red-600">{error}</p>
      ) : null}

      <div>
        {loading && bidangList.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">Memuat admin bidang/UPTB...</p>
        ) : bidangList.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Belum ada admin bidang/UPTB.
          </p>
        ) : (
          bidangList.map((bidang, index) => (
            <BidangRow
              key={bidang.id}
              index={index + 1}
              bidang={bidang}
              onToggleStatus={() => {
                void toggleStatus(bidang.id);
              }}
              onUpdateAdmin={(values) => {
                void updateAdmin(bidang.id, values);
              }}
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
