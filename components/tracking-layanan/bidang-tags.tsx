import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";

export default function BidangTags({
  items,
  inline = false,
}: {
  items: string[];
  inline?: boolean;
}) {
  const maxVisible = 2;
  const visible = items.slice(0, maxVisible);
  const extra = items.length - visible.length;

  return (
    <div className={inline ? "flex flex-wrap items-center gap-1.5" : "flex flex-col gap-1"}>
      {visible.map((item) => (
        <span
          key={item}
          className="inline-flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] whitespace-nowrap text-slate-600"
        >
          <LabelOutlinedIcon sx={{ fontSize: 12 }} className="text-slate-400" />
          {item}
        </span>
      ))}
      {extra > 0 ? (
        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
