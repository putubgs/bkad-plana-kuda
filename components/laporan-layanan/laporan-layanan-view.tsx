import SummaryStats from "@/components/laporan-layanan/summary-stats";
import DurationIndicatorChart from "@/components/laporan-layanan/duration-indicator-chart";
import StatusRecap from "@/components/laporan-layanan/status-recap";
import BidangDistribution from "@/components/laporan-layanan/bidang-distribution";

export default function LaporanLayananView() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Laporan Layanan</h1>
        <p className="text-sm text-slate-500">
          Rekap, durasi, dan analitik layanan Plana Kuda
        </p>
      </div>

      <SummaryStats />
      <DurationIndicatorChart />
      <StatusRecap />
      <BidangDistribution />
    </div>
  );
}
