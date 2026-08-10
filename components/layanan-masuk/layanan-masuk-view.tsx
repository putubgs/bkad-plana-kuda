import LayananMasukPageHeader from "@/components/layanan-masuk/page-header";
import LayananTable from "@/components/layanan-masuk/layanan-table";

export default function LayananMasukView() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <LayananMasukPageHeader />
      <LayananTable />
    </div>
  );
}
