import LayananTable from "@/components/layanan-masuk/layanan-table";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsCards from "@/components/dashboard/stats-cards";
import NotificationFlow from "@/components/dashboard/notification-flow";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <WelcomeBanner />
      <StatsCards />
      <NotificationFlow />
      <LayananTable />
    </div>
  );
}
