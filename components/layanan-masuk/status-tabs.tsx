"use client";

import { statusFiltersForRole } from "@/lib/auth/roles";
import { type StatusFilterValue } from "@/data/data-layanan";
import { useCurrentUser } from "@/components/auth/current-user-provider";

export default function StatusTabs({
  active,
  onChange,
}: {
  active: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}) {
  const { role } = useCurrentUser();
  const filters = statusFiltersForRole(role);

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-full bg-slate-100 p-1">
      {filters.map((filter) => {
        const isActive = filter.value === active;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
