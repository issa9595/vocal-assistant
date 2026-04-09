/**
 * @file YearView.tsx
 * @description Vue annuelle du calendrier
 */

"use client";

import { useState, useMemo } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import type { CalendarEvent } from "@/types/message";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const formatDayHeader = (date: Date): string =>
  date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

const formatTime = (date: Date): string =>
  date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const getAvailableYears = (): number[] => {
  const y = new Date().getFullYear();
  return Array.from({ length: 21 }, (_, i) => y - 10 + i);
};

export function YearView() {
  const { events, referenceDate } = useCalendarStore();
  const [selectedYear, setSelectedYear] = useState(referenceDate.getFullYear());

  const yearStart = useMemo(() => {
    const d = new Date(selectedYear, 0, 1);
    d.setHours(0, 0, 0, 0); return d;
  }, [selectedYear]);

  const yearEnd = useMemo(() => {
    const d = new Date(selectedYear, 11, 31);
    d.setHours(23, 59, 59, 999); return d;
  }, [selectedYear]);

  const eventsByMonth = useMemo(() => {
    const byMonth: Record<number, Record<string, CalendarEvent[]>> = {};
    events
      .filter(e => e.start < yearEnd && e.end > yearStart)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .forEach(e => {
        const m = e.start.getMonth();
        const k = e.start.toISOString().split("T")[0];
        (byMonth[m] ??= {});
        (byMonth[m][k] ??= []).push(e);
      });
    return byMonth;
  }, [events, yearStart, yearEnd]);

  const availableYears = getAvailableYears();
  const isCurrentYear = useMemo(() => new Date().getFullYear() === selectedYear, [selectedYear]);

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden glass glass-grain text-[var(--color-brand-black)]">

      {/* ========== HEADER ========== */}
      <header className="
        sticky top-0 z-10
        glass-panel glass-grain
        border-b border-[rgba(255,255,255,0.3)]
        px-4 md:px-6 lg:px-8 py-3 md:py-4
      ">
        <div className="flex items-center gap-3 md:gap-4 mb-3 max-w-5xl mx-auto">

          {/* Sélecteur d'année */}
          <div className="relative w-full md:w-auto md:min-w-[200px] glass rounded-xl hover:scale-[1.02] transition-all duration-200">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              style={{ outline: "none" }}
              className="w-full px-3 md:px-4 pr-8 py-2 md:py-2.5 rounded-xl bg-transparent text-[var(--color-brand-black)] text-sm md:text-base font-semibold cursor-pointer appearance-none"
            >
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3D3D3D66]" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>

        {isCurrentYear && <p className="text-xs text-[#3D3D3D99]">Année actuelle</p>}
      </header>

      {/* ========== CONTENU ========== */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {Object.keys(eventsByMonth).length > 0 ? (
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {MONTHS.map((monthName, monthIndex) => {
              const monthEvents = eventsByMonth[monthIndex];
              if (!monthEvents || Object.keys(monthEvents).length === 0) return null;

              return (
                <div
                  key={monthIndex}
                  className="flex flex-col p-4 md:p-5 rounded-xl glass hover:scale-[1.01] transition-all duration-200"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-[var(--color-brand-black)] mb-4 pb-3 border-b border-[rgba(255,255,255,0.3)]">
                    {monthName} {selectedYear}
                  </h2>

                  <div className="flex flex-col gap-6">
                    {Object.entries(monthEvents)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([dayKey, dayEvents]) => {
                        const date = new Date(dayKey);
                        const today = new Date(); today.setHours(0, 0, 0, 0);
                        const ds = new Date(date); ds.setHours(0, 0, 0, 0);
                        const isToday = today.getTime() === ds.getTime();

                        return (
                          <div key={dayKey} className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-base font-semibold text-[var(--color-brand-black)]">
                                {formatDayHeader(date)}
                              </h3>
                              {isToday && (
                                <span className="text-xs text-[#3D3D3DCC] glass-teal px-2 py-0.5 rounded-full">
                                  Aujourd'hui
                                </span>
                              )}
                              <span className="text-xs text-[#3D3D3D66]">
                                {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="flex flex-col gap-2">
                              {dayEvents.map(event => (
                                <div
                                  key={event.id}
                                  className="flex items-start gap-3 p-3 rounded-xl glass-pink glass-highlight hover:scale-[1.01] transition-all duration-200"
                                >
                                  <div className="flex-shrink-0 w-14 text-xs text-[#3D3D3D99] font-medium pt-0.5">
                                    {formatTime(event.start)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--color-brand-black)]">{event.title}</div>
                                    {event.description && (
                                      <div className="text-xs text-[#3D3D3D99] mt-1 line-clamp-2">{event.description}</div>
                                    )}
                                    {event.location && (
                                      <div className="text-xs text-[#3D3D3D66] mt-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
          <div className="flex items-center justify-center h-full text-[#3D3D3D66]">
            <p className="text-sm md:text-base">Aucun événement pour {selectedYear}</p>
          </div>
        )}
      </main>
    </div>
  );
}
