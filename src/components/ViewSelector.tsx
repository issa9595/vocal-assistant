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
    <div className="
      flex 
      items-center 
      gap-2 md:gap-3
      w-full md:w-auto
    ">
      <label 
        htmlFor="view-select" 
        className="
          text-sm md:text-base
          text-[#3D3D3D99]
          whitespace-nowrap
        "
      >
        Vue :
      </label>
      <select
        id="view-select"
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value as "day" | "week" | "month" | "year")}
        className="
          flex-1 md:flex-none md:min-w-[140px]
          px-3 md:px-4
          py-2 md:py-2.5
          rounded-medium
          bg-[var(--color-brand-white)] 
          border border-[#3D3D3D0D]
          text-[var(--color-brand-black)] 
          text-sm md:text-base
          font-semibold
          focus:outline-none focus:ring-2 focus:ring-brand-blue/50
          cursor-pointer
          shadow-soft hover:shadow-medium
          transition-all duration-200
        "
      >
        {Object.entries(viewLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

