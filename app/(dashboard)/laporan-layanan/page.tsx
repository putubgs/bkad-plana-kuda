import { redirect } from "next/navigation";
import LaporanLayananView from "@/components/laporan-layanan/laporan-layanan-view";
import { getCurrentUser } from "@/lib/auth/dal";
import { isSuperadmin } from "@/lib/auth/roles";

export default async function LaporanLayananPage() {
  const user = await getCurrentUser();
  if (!isSuperadmin(user.role)) {
    redirect("/");
  }

  return <LaporanLayananView />;
}
