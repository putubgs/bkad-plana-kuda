"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { useTransition } from "react";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import { isSuperadmin } from "@/lib/auth/roles";

export interface SidebarUser {
  username: string;
  role: string;
  departmentName?: string | null;
}

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ fontSize?: "small" | "medium" | "large" | "inherit" }>;
  badge?: number;
  superadminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: SpaceDashboardOutlinedIcon },
  {
    label: "Layanan Masuk",
    href: "/layanan-masuk",
    icon: InboxOutlinedIcon,
    badge: 3,
  },
  {
    label: "Tracking Layanan",
    href: "/tracking-layanan",
    icon: AltRouteOutlinedIcon,
  },
  {
    label: "Laporan Layanan",
    href: "/laporan-layanan",
    icon: LeaderboardOutlinedIcon,
    superadminOnly: true,
  },
  { label: "Pengaturan", href: "/pengaturan", icon: SettingsOutlinedIcon },
];

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const initials = user.username.slice(0, 2).toUpperCase();
  const navItems = NAV_ITEMS.filter(
    (item) => !item.superadminOnly || isSuperadmin(user.role)
  );

  function handleLogout() {
    startLogoutTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/auth/logout");
      router.push(result.redirectTo ?? "/login");
      router.refresh();
    });
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#0F2044]">
      <div className="flex items-center gap-3 px-5 py-5">
        <Image
          src="/logo-nusa-tenggara-barat.png"
          alt="Logo Nusa Tenggara Barat"
          width={40}
          height={59}
          priority
          className="h-10 w-auto"
        />
        <div className="leading-tight">
          <p className="text-[15px] font-bold text-white">BKAD NTB</p>
          <p className="text-xs font-medium text-[#8FB4F5]">Plana Kuda Admin</p>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/10" />

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="px-2 pb-3 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
          Menu Utama
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon, badge }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-semibold transition-colors ${
                    isActive
                      ? "bg-[#155DFC] text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon fontSize="small" />
                  <span className="flex-1">{label}</span>
                  {badge ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6900] px-1.5 text-[11px] font-bold text-white">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className=" h-px mt-5 bg-white/10" />
        <div className="py-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-semibold text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogoutOutlinedIcon fontSize="small" />
            <span>{isLoggingOut ? "Memproses..." : "Keluar"}</span>
          </button>
        </div>
      </nav>

      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#223153] px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5B8DFB] text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-white">{user.username}</p>
            <p className="truncate text-xs text-slate-400 capitalize">
              {user.departmentName ? `${user.role} · ${user.departmentName}` : user.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
