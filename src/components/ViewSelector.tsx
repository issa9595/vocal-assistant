/**
 * @file ViewSelector.tsx
 * @description Composant de sélection de vue du calendrier
 * 
 * Permet de choisir entre Jour, Semaine, Mois, Année
 */

"use client";

import { useCalendarStore } from "@/store/useCalendarStore";

const viewLabels: Record<"day" | "week" | "month" | "year", string> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
  year: "Année",
};

/**
 * Composant ViewSelector
 * Affiche un select pour choisir la vue du calendrier
 */
export function ViewSelector() {
  const { viewMode, setViewMode } = useCalendarStore();

  return (
    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
      <label
        htmlFor="view-select"
        className="text-sm md:text-base text-[#3D3D3D99] whitespace-nowrap"
      >
        Vue :
      </label>

      {/* Wrapper glass — backdrop-filter ne s'applique pas sur <select> natif */}
      <div className="relative flex-1 md:flex-none md:min-w-[160px] glass rounded-xl hover:scale-[1.02] transition-all duration-200">
        <select
          id="view-select"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as "day" | "week" | "month" | "year")}
          style={{ outline: "none" }}
          className="
            w-full
            px-3 md:px-4 pr-8
            py-2 md:py-2.5
            rounded-xl
            bg-transparent
            text-[var(--color-brand-black)]
            text-sm md:text-base
            font-semibold
            cursor-pointer
            appearance-none
          "
        >
          {Object.entries(viewLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {/* Chevron custom */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3D3D3D66]" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

