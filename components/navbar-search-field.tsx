import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function NavbarSearchField() {
  return (
    <div className="flex w-64 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-colors focus-within:border-slate-300 focus-within:bg-white">
      <SearchOutlinedIcon fontSize="small" className="text-slate-400" />
      <input
        type="search"
        placeholder="Cari tiket, pemohon..."
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
