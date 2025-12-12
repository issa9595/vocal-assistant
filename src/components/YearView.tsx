/**
 * @file YearView.tsx
 * @description Vue annuelle du calendrier
 * 
 * Affiche les événements d'une année sélectionnée, regroupés par mois.
 */

"use client";

import { useState, useMemo } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import type { CalendarEvent } from "@/types/message";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/**
 * Formate une date pour l'affichage (ex: "Lundi 11 décembre")
 */
const formatDayHeader = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

/**
 * Formate une heure pour l'affichage (ex: "14:30")
 */
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Génère les années disponibles (année actuelle ± 10 ans)
 */
const getAvailableYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
};

/**
 * Composant YearView
 * Affiche une vue annuelle avec sélection d'année
 */
export function YearView() {
  const { events, referenceDate } = useCalendarStore();
  
  const [selectedYear, setSelectedYear] = useState(referenceDate.getFullYear());

  // Calculer le début et la fin de l'année sélectionnée
  const yearStart = useMemo(() => {
    const date = new Date(selectedYear, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [selectedYear]);

  const yearEnd = useMemo(() => {
    const date = new Date(selectedYear, 11, 31);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [selectedYear]);

  // Filtrer les événements de l'année et les regrouper par mois puis par jour
  const eventsByMonth = useMemo(() => {
    const byMonth: Record<number, Record<string, CalendarEvent[]>> = {};
    
    const yearEvents = events
      .filter((event) => {
        return event.start < yearEnd && event.end > yearStart;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    yearEvents.forEach((event) => {
      const month = event.start.getMonth();
      const dayKey = event.start.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      
      if (!byMonth[month]) {
        byMonth[month] = {};
      }
      if (!byMonth[month][dayKey]) {
        byMonth[month][dayKey] = [];
      }
      byMonth[month][dayKey].push(event);
    });

    return byMonth;
  }, [events, yearStart, yearEnd]);

  const availableYears = getAvailableYears();
  const isCurrentYear = useMemo(() => {
    const today = new Date();
    return today.getFullYear() === selectedYear;
  }, [selectedYear]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-brand-white)] text-[var(--color-brand-black)]">
      {/* ========== HEADER DE SÉLECTION ========== */}
      <header className="
        sticky top-0 z-10 
        bg-[var(--color-brand-white)] 
        border-b border-[#3D3D3D1A] 
        px-4 md:px-6 lg:px-8
        py-3 md:py-4
      ">
        <div className="
          flex items-center 
          gap-3 md:gap-4
          mb-3
          max-w-3xl md:max-w-4xl lg:max-w-5xl
          mx-auto
        ">
          {/* Sélecteur d'année */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="
              w-full md:w-auto md:min-w-[200px]
              px-3 md:px-4
              py-2 md:py-3
              rounded-soft
              bg-[var(--color-brand-white)] 
              border border-[#3D3D3D1A]
              text-[var(--color-brand-black)] 
              text-sm md:text-base
              focus:outline-none focus:ring-2 focus:ring-brand-blue
              cursor-pointer
              shadow-soft
            "
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Indicateur année actuelle */}
        {isCurrentYear && (
          <p className="text-xs text-[#3D3D3D99]">Année actuelle</p>
        )}
      </header>

      {/* ========== LISTE DES ÉVÉNEMENTS PAR MOIS ========== */}
      <main className="
        flex-1 
        overflow-y-auto 
        px-4 md:px-6 lg:px-8
        py-4 md:py-6
      ">
        {Object.keys(eventsByMonth).length > 0 ? (
          <div className="
            flex flex-col 
            md:grid md:grid-cols-2
            lg:grid-cols-3
            gap-6 md:gap-8
            max-w-6xl
            mx-auto
          ">
            {/* 
              Layout responsive :
              MOBILE : liste verticale (flex-col) - mois empilés
              TABLETTE (md+) : grille 2 colonnes
              DESKTOP (lg+) : grille 3 colonnes
            */}
            {MONTHS.map((monthName, monthIndex) => {
              const monthEvents = eventsByMonth[monthIndex];
              if (!monthEvents || Object.keys(monthEvents).length === 0) {
                return null;
              }

              return (
                <div 
                  key={monthIndex} 
                  className="
                    flex flex-col
                    p-4 md:p-5 lg:p-6
                    rounded-medium
                    bg-[var(--color-brand-white)]
                    border border-[#3D3D3D0D]
                    shadow-soft
                    hover:shadow-medium
                    transition-all duration-200
                  "
                >
                  {/* En-tête du mois */}
                  <h2 className="
                    text-lg md:text-xl lg:text-2xl
                    font-semibold 
                    text-[var(--color-brand-black)] 
                    mb-4 md:mb-6
                    pb-3 md:pb-4
                    border-b border-[#3D3D3D1A]
                  ">
                    {monthName} {selectedYear}
                  </h2>

                  {/* Liste des jours avec événements */}
                  <div className="flex flex-col gap-6">
                    {Object.entries(monthEvents)
                      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                      .map(([dayKey, dayEvents]) => {
                        const date = new Date(dayKey);
                        // Calcul simple sans useMemo pour éviter les problèmes de hooks conditionnels
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dayStart = new Date(date);
                        dayStart.setHours(0, 0, 0, 0);
                        const isToday = today.getTime() === dayStart.getTime();

                        return (
                          <div key={dayKey} className="flex flex-col">
                            {/* En-tête du jour */}
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className={`
                                  text-base font-semibold
                                  ${isToday ? "text-[var(--color-brand-black)]" : "text-[var(--color-brand-black)]"}
                                `}
                              >
                                {formatDayHeader(date)}
                              </h3>
                              {isToday && (
                                <span className="text-xs text-[#3D3D3DCC] bg-[#CCE3C34D] px-2 py-0.5 rounded-soft">
                                  Aujourd'hui
                                </span>
                              )}
                              <span className="text-xs text-[#3D3D3D0D]0">
                                {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            {/* Liste des événements */}
                            <div className="flex flex-col gap-2">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className="
                                    flex items-start gap-3
                                    p-3 md:p-4
                                    rounded-medium
                                    bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                                    border-none
                                    shadow-soft
                                    hover:shadow-medium
                                    transition-all duration-200
                                  "
                                >
                                  {/* Heure */}
                                  <div className="flex-shrink-0 w-16 text-xs text-[#3D3D3D99] font-medium pt-0.5">
                                    {formatTime(event.start)}
                                  </div>

                                  {/* Contenu */}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--color-brand-black)]">
                                      {event.title}
                                    </div>
                                    {event.description && (
                                      <div className="text-xs text-[#3D3D3D99] mt-1 line-clamp-2">
                                        {event.description}
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="text-xs text-[#3D3D3D0D]0 mt-1 flex items-center gap-1">
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                        {event.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="
            flex items-center justify-center 
            h-full 
            text-[#3D3D3D66]
            max-w-3xl md:max-w-4xl lg:max-w-5xl
            mx-auto
          ">
            <p className="
              text-sm md:text-base
            ">
              Aucun événement pour {selectedYear}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

