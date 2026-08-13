import ProfileCard from "@/components/pengaturan/profile-card";
import MfaSettingsCard from "@/components/pengaturan/mfa-settings-card";
import BidangUptbList from "@/components/pengaturan/bidang-uptb-list";
import NotificationSettings from "@/components/pengaturan/notification-settings";
import { getCurrentUser } from "@/lib/auth/dal";

export default async function PengaturanView() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500">
          Konfigurasi sistem, bidang aktif, dan profil admin
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-5">
        <ProfileCard user={user} />
        <MfaSettingsCard mfaEnabled={user.mfaEnabled} />
        <BidangUptbList />
        <NotificationSettings />
      </div>
    </div>
  );
}
