import ProfileCard from "@/components/pengaturan/profile-card";
import BidangUptbList from "@/components/pengaturan/bidang-uptb-list";
import NotificationSettings from "@/components/pengaturan/notification-settings";

export default function PengaturanView() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500">
          Konfigurasi sistem, bidang aktif, dan profil admin
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-5">
        <ProfileCard />
        <BidangUptbList />
        <NotificationSettings />
      </div>
    </div>
  );
}
