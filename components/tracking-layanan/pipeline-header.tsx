export default function PipelineHeader({
  total,
  perluTindakLanjut,
}: {
  total: number;
  perluTindakLanjut: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-slate-900">
          Pipeline Layanan Plana Kuda
        </h1>
        <p className="text-sm text-slate-500">
          {total} tiket total · {perluTindakLanjut} perlu tindak lanjut
        </p>
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Live
      </span>
    </div>
  );
}
