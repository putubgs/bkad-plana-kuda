"use client";

import { STATUS_FILTERS, type StatusFilterValue } from "@/data/data-layanan";

export default function StatusTabs({
  active,
  onChange,
}: {
  active: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-full bg-slate-100 p-1">
      {STATUS_FILTERS.map((filter) => {
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
