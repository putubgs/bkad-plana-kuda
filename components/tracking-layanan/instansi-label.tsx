import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";

export default function InstansiLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs whitespace-nowrap text-slate-500">
      <ApartmentOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
      {label}
    </span>
  );
}
