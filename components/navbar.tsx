"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavbarSearchField from "@/components/navbar-search-field";
import NavbarNotificationButton from "@/components/navbar-notification-button";
import NavbarProfile from "@/components/navbar-profile";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/layanan-masuk": "Layanan Masuk",
  "/tracking-layanan": "Tracking Layanan",
  "/laporan-layanan": "Laporan Layanan",
  "/pengaturan": "Pengaturan",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          aria-label="Dashboard"
          className="flex items-center text-slate-400 transition-colors hover:text-slate-600"
        >
          <GridViewOutlinedIcon fontSize="small" />
        </Link>
        <NavigateNextOutlinedIcon
          fontSize="small"
          className="text-slate-300"
        />
        <span className="text-sm font-semibold text-slate-900">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <NavbarSearchField />
        <NavbarNotificationButton count={5} />
        <NavbarProfile />
      </div>
    </header>
  );
}
