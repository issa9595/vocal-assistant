/**
 * @file WeekView.tsx
 * @description Vue hebdomadaire du calendrier
 * 
 * Affiche les 7 jours de la semaine avec les événements listés pour chaque jour.
 * La semaine commence le lundi.
 */

"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import type { CalendarEvent } from "@/types/message";

/**
 * Formate une date pour l'affichage (ex: "Lundi 11")
 */
const formatDayHeader = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
  });
};

/**
 * Formate une date pour l'affichage complet (ex: "Lundi 11 décembre")
 */
const formatDayFull = (date: Date): string => {
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
 * Obtient le lundi de la semaine contenant la date donnée
 */
const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi = 1
  return new Date(d.setDate(diff));
};

/**
 * Génère les 7 jours de la semaine à partir du lundi
 */
const getWeekDays = (monday: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }
  return days;
};

/**
 * Composant WeekView
 * Affiche une vue hebdomadaire avec les événements de chaque jour
 */
export function WeekView() {
  const { events, referenceDate, setReferenceDate, goToToday } = useCalendarStore();

  // Calculer le lundi de la semaine
  const weekStart = useMemo(() => {
    return getMondayOfWeek(referenceDate);
  }, [referenceDate]);

  // Générer les 7 jours de la semaine
  const weekDays = useMemo(() => {
    return getWeekDays(weekStart);
  }, [weekStart]);

  // Filtrer les événements par jour
  const eventsByDay = useMemo(() => {
    const byDay: Record<number, CalendarEvent[]> = {};
    
    weekDays.forEach((day, index) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayEvents = events
        .filter((event) => {
          return event.start < dayEnd && event.end > dayStart;
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      
      byDay[index] = dayEvents;
    });
    
    return byDay;
  }, [events, weekDays]);

  /**
   * Navigation vers la semaine précédente
   */
  const goToPreviousWeek = () => {
    const prevWeek = new Date(weekStart);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setReferenceDate(prevWeek);
  };

  /**
   * Navigation vers la semaine suivante
   */
  const goToNextWeek = () => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setReferenceDate(nextWeek);
  };

  /**
   * Vérifie si la semaine affichée contient aujourd'hui
   */
  const isCurrentWeek = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return today >= weekStart && today <= weekEnd;
  }, [weekStart]);

  // Minuit d'aujourd'hui — calculé une fois en dehors du .map()
  const todayMidnight = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden glass glass-grain text-[var(--color-brand-black)]">
      {/* ========== HEADER DE NAVIGATION ========== */}
      <header
        aria-label="Navigation de la semaine"
        className="sticky top-0 z-10 glass-panel glass-grain border-b border-[rgba(255,255,255,0.3)] px-4 py-4"
      >
        <div className="flex items-center justify-between mb-3">
          {/* Bouton semaine précédente */}
          <button
            onClick={goToPreviousWeek}
            className="
              w-10 h-10 rounded-full glass
              flex items-center justify-center
              hover:scale-110 hover:shadow-md
              text-[var(--color-brand-black)]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#96b6dd]/50
            "
            aria-label="Semaine précédente"
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Période de la semaine */}
          <div className="flex-1 text-center md:text-left px-4 md:px-0">
            <h2 className="
              text-lg md:text-xl lg:text-2xl
              font-bold
              text-[var(--color-brand-black)]
              tracking-tight
            ">
              Semaine du {formatDayFull(weekStart)} au {formatDayFull(weekDays[6])}
            </h2>
            {isCurrentWeek && (
              <p aria-live="polite" className="
                text-[10px] md:text-xs
                text-[#3D3D3D80]
                mt-1
                font-medium
              ">
                Cette semaine
              </p>
            )}
          </div>

          {/* Bouton semaine suivante */}
          <button
            onClick={goToNextWeek}
            className="
              w-10 h-10 rounded-full glass
              flex items-center justify-center
              hover:scale-110 hover:shadow-md
              text-[var(--color-brand-black)]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#96b6dd]/50
            "
            aria-label="Semaine suivante"
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bouton "Cette semaine" */}
        {!isCurrentWeek && (
          <button
            onClick={goToToday}
            className="
              w-full py-3 px-4 rounded-medium
              bg-[linear-gradient(135deg,#f4b4c8_0%,#fcecd3_100%)]
              text-[var(--color-brand-black)] text-sm font-bold
              transition-all duration-200 hover:opacity-90 hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-[#96b6dd]/50
              shadow-soft
            "
          >
            Cette semaine
          </button>
        )}
      </header>

      {/* ========== LISTE DES JOURS ========== */}
      <main
        aria-label="Vue hebdomadaire"
        className="
          flex-1
          overflow-y-auto md:overflow-visible
          px-4
          md:px-0
          py-4
          md:py-6
          w-full
        "
      >
        <div className="
          w-full
          flex flex-col
          md:grid md:grid-cols-7
          gap-4
          md:gap-4
          lg:gap-5
        ">
          {weekDays.map((day, index) => {
            const dayEvents = eventsByDay[index] || [];
            // Computed without useMemo — hooks cannot be called inside .map()
            const dayMidnight = new Date(day);
            dayMidnight.setHours(0, 0, 0, 0);
            const isToday = todayMidnight.getTime() === dayMidnight.getTime();
            const dayLabel = day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

            return (
              <section
                key={index}
                aria-label={`${dayLabel}${isToday ? " — Aujourd'hui" : ""}, ${dayEvents.length} événement${dayEvents.length > 1 ? "s" : ""}`}
                className="
                  flex flex-col
                  p-3
                  md:p-3
                  rounded-xl
                  glass glass-grain glass-highlight
                  hover:scale-[1.005]
                  transition-all duration-200
                  md:h-fit
                  md:min-w-0
                "
              >
                {/* En-tête du jour */}
                <div
                  aria-hidden="true"
                  className="
                    flex flex-col
                    gap-1
                    mb-2 md:mb-3
                    pb-2 md:pb-3
                    border-b border-[#3D3D3D0D]
                  "
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`
                        text-base
                        md:text-sm
                        font-bold
                        ${isToday ? "text-[var(--color-brand-black)]" : "text-[#3D3D3DE6]"}
                        flex items-baseline gap-1
                      `}
                    >
                      {day.toLocaleDateString("fr-FR", { weekday: "long" })}
                      <span className="text-lg md:text-base text-[var(--color-brand-black)]">
                        {day.getDate()}
                      </span>
                    </h3>
                    {isToday && (
                      <span className="
                        text-[9px] md:text-[10px]
                        text-[#3D3D3DCC]
                        bg-[#9dc0bc40]
                        px-2 py-0.5
                        rounded-full
                        font-bold
                        uppercase
                        tracking-wide
                        self-center
                      ">
                        Aujourd'hui
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] md:text-[10px] text-[#3D3D3D80] font-medium">
                    {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Liste des événements */}
                {dayEvents.length > 0 ? (
                  <ul role="list" className="flex flex-col gap-2">
                    {dayEvents.map((event) => (
                      <li
                        key={event.id}
                        aria-label={`${event.title} à ${formatTime(event.start)}${event.location ? `, ${event.location}` : ""}`}
                        className="
                          flex items-start gap-2
                          md:gap-2
                          p-2.5
                          md:p-2.5
                          rounded-medium
                          glass-pink glass-highlight
                          hover:scale-[1.01]
                          transition-all duration-200
                          group
                        "
                      >
                        {/* Heure */}
                        <div aria-hidden="true" className="flex-shrink-0">
                          <div className="
                            w-10 md:w-10
                            text-[10px] md:text-[10px]
                            text-[#3D3D3DB3]
                            font-semibold
                            pt-0.5
                          ">
                            {formatTime(event.start)}
                          </div>
                        </div>

                        {/* Contenu */}
                        <div aria-hidden="true" className="flex-1 min-w-0">
                          <div className="
                            text-xs md:text-xs
                            font-bold
                            text-[var(--color-brand-black)]
                            group-hover:text-[#3D3D3DE6]
                            transition-colors
                            line-clamp-2
                            leading-tight
                          ">
                            {event.title}
                          </div>
                          {event.description && (
                            <div className="
                              text-[10px] md:text-[10px]
                              text-[#3D3D3D99]
                              mt-1
                              line-clamp-2
                              leading-relaxed
                            ">
                              {event.description}
                            </div>
                          )}
                          {event.location && (
                            <div className="
                              text-[10px] md:text-[10px]
                              text-[#3D3D3D80]
                              mt-1
                              flex items-center gap-1
                            ">
                              <svg aria-hidden="true" className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="
                    text-xs md:text-sm
                    text-[#3D3D3D66]
                    italic
                    py-2 md:py-3
                    text-center
                  ">
                    Aucun événement
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

