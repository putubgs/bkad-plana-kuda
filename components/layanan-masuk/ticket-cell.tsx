import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export default function TicketCell({
  noTiket,
  perluTindakLanjut,
}: {
  noTiket: string;
  perluTindakLanjut?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-sm font-bold whitespace-nowrap text-blue-600">
        {noTiket}
      </span>
      {perluTindakLanjut ? (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-amber-600">
          <WarningAmberOutlinedIcon sx={{ fontSize: 12 }} />
          Perlu Tindak Lanjut
        </span>
      ) : null}
    </div>
  );
}
