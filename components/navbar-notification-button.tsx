import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export default function NavbarNotificationButton({
  count = 0,
}: {
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-label="Notifikasi"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
    >
      <NotificationsNoneOutlinedIcon fontSize="small" />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}
