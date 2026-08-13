import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

export interface NavbarProfileUser {
  username: string;
  role: string;
}

export default function NavbarProfile({ user }: { user: NavbarProfileUser }) {
  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-slate-100"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5B8DFB] text-xs font-bold text-white">
        {initials}
      </div>
      <div className="hidden text-left leading-tight sm:block">
        <p className="text-sm font-bold text-slate-900">{user.username}</p>
        <p className="text-xs text-slate-400 capitalize">{user.role}</p>
      </div>
      <KeyboardArrowDownOutlinedIcon
        fontSize="small"
        className="text-slate-400"
      />
    </button>
  );
}
