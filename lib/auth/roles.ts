import {
  STATUS_FILTERS,
  STATUS_ORDER,
  STATUS_PIPELINE,
  type StatusLayanan,
} from "@/data/data-layanan";

export type AppRole = "superadmin" | "admin";

export type CurrentUser = {
  userId: string;
  username: string;
  email: string;
  role: string;
  departmentName: string | null;
  biography: string | null;
  mfaEnabled: boolean;
};

export function isSuperadmin(role: string) {
  return role.toLowerCase() === "superadmin";
}

export function isAdmin(role: string) {
  return role.toLowerCase() === "admin";
}

export function isStaff(role: string) {
  return isSuperadmin(role) || isAdmin(role);
}

export function statusesForRole(role: string): StatusLayanan[] {
  if (isAdmin(role)) {
    return STATUS_ORDER.filter((status) => status !== "Diterima");
  }
  return STATUS_ORDER;
}

export function statusFiltersForRole(role: string) {
  if (isAdmin(role)) {
    return STATUS_FILTERS.filter((item) => item.value !== "Diterima");
  }
  return STATUS_FILTERS;
}

export function pipelineForRole(role: string): StatusLayanan[] {
  if (isAdmin(role)) {
    return STATUS_PIPELINE.filter((status) => status !== "Diterima");
  }
  return STATUS_PIPELINE;
}
