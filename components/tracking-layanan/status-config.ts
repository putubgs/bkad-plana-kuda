import type { ComponentType } from "react";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import type { StatusLayanan } from "@/data/data-layanan";

type IconType = ComponentType<{
  fontSize?: "small" | "medium" | "large" | "inherit";
  className?: string;
}>;

interface StatusMeta {
  icon: IconType;
  iconBg: string;
  text: string;
  softBg: string;
  softBorder: string;
  borderLeft: string;
  topBorder: string;
}

export const STATUS_META: Record<StatusLayanan, StatusMeta> = {
  Diterima: {
    icon: MailOutlineOutlinedIcon,
    iconBg: "bg-blue-600",
    text: "text-blue-600",
    softBg: "bg-blue-50",
    softBorder: "border-blue-200",
    borderLeft: "border-l-blue-500",
    topBorder: "border-t-blue-500",
  },
  Diverifikasi: {
    icon: TaskAltOutlinedIcon,
    iconBg: "bg-orange-500",
    text: "text-orange-600",
    softBg: "bg-orange-50",
    softBorder: "border-orange-200",
    borderLeft: "border-l-orange-500",
    topBorder: "border-t-orange-500",
  },
  Diproses: {
    icon: AutorenewOutlinedIcon,
    iconBg: "bg-indigo-600",
    text: "text-indigo-600",
    softBg: "bg-indigo-50",
    softBorder: "border-indigo-200",
    borderLeft: "border-l-indigo-500",
    topBorder: "border-t-indigo-500",
  },
  Selesai: {
    icon: CheckCircleOutlinedIcon,
    iconBg: "bg-emerald-600",
    text: "text-emerald-600",
    softBg: "bg-emerald-50",
    softBorder: "border-emerald-200",
    borderLeft: "border-l-emerald-500",
    topBorder: "border-t-emerald-500",
  },
  Ditolak: {
    icon: CancelOutlinedIcon,
    iconBg: "bg-red-600",
    text: "text-red-600",
    softBg: "bg-red-50",
    softBorder: "border-red-200",
    borderLeft: "border-l-red-500",
    topBorder: "border-t-red-500",
  },
};
