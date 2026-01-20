/**
 * @file DailyCalendar.tsx
 * @description Composant de vue journalière (daily view) pour le calendrier
 * 
 * Affiche une seule journée avec des créneaux horaires (00:00 à 23:00)
 * et positionne les événements verticalement selon leur heure de début/fin.
 * Mobile-first design avec navigation jour précédent/suivant.
 */

"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import type { CalendarEvent } from "@/types/message";

/**
 * Créneaux horaires de la journée (00:00 à 23:00)
 */
const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Formate une heure en format HH:MM
 */
const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, "0")}:00`;
};

/**
 * Calcule la position verticale d'un événement dans la timeline
 * @param start Heure de début de l'événement
 * @param dayStart Début de la journée (00:00)
 * @returns Position en pourcentage (0-100)
 */
const calculateEventPosition = (start: Date, dayStart: Date): number => {
  const startTime = start.getTime();
  const dayStartTime = dayStart.getTime();
  const dayEndTime = dayStartTime + 24 * 60 * 60 * 1000;
  
  if (startTime < dayStartTime) return 0;
  if (startTime >= dayEndTime) return 100;
  
  const elapsed = startTime - dayStartTime;
  const total = dayEndTime - dayStartTime;
  return (elapsed / total) * 100;
};

/**
 * Calcule la hauteur d'un événement en pourcentage
 * @param start Heure de début
 * @param end Heure de fin
 * @param dayStart Début de la journée
 * @returns Hauteur en pourcentage (0-100)
 */
const calculateEventHeight = (start: Date, end: Date, dayStart: Date): number => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const dayStartTime = dayStart.getTime();
  const dayEndTime = dayStartTime + 24 * 60 * 60 * 1000;
  
  // Limiter aux bornes de la journée
  const effectiveStart = Math.max(startTime, dayStartTime);
  const effectiveEnd = Math.min(endTime, dayEndTime);
  
  if (effectiveStart >= effectiveEnd) return 0;
  
  const duration = effectiveEnd - effectiveStart;
  const total = dayEndTime - dayStartTime;
  return (duration / total) * 100;
};

/**
 * Formate une date pour l'affichage (ex: "Lundi 11 décembre 2025")
 */
const formatDateHeader = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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
 * Composant DailyCalendar
 * Affiche une vue journalière avec créneaux horaires et événements
 */
export function DailyCalendar() {
  const {
    events,
    referenceDate,
    setReferenceDate,
    goToToday,
  } = useCalendarStore();

  // Calculer le début de la journée affichée (00:00)
  const dayStart = useMemo(() => {
    const date = new Date(referenceDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [referenceDate]);

  // Calculer la fin de la journée affichée (23:59:59)
  const dayEnd = useMemo(() => {
    const date = new Date(dayStart);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [dayStart]);

  // Filtrer les événements de la journée
  const dayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStart = event.start;
      const eventEnd = event.end;
      
      // Un événement est dans la journée s'il chevauche la journée
      return eventStart < dayEnd && eventEnd > dayStart;
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, dayStart, dayEnd]);

  /**
   * Navigation vers le jour précédent
   */
  const goToPreviousDay = () => {
    const prevDay = new Date(dayStart);
    prevDay.setDate(prevDay.getDate() - 1);
    setReferenceDate(prevDay);
  };

  /**
   * Navigation vers le jour suivant
   */
  const goToNextDay = () => {
    const nextDay = new Date(dayStart);
    nextDay.setDate(nextDay.getDate() + 1);
    setReferenceDate(nextDay);
  };

  /**
   * Vérifie si la date affichée est aujourd'hui
   */
  const isToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dayStart.getTime() === today.getTime();
  }, [dayStart]);

  return (
    <div className="
      flex flex-col md:flex-row
      h-full 
      bg-[var(--color-brand-white)] 
      text-[var(--color-brand-black)]
      md:min-h-[70vh]
    ">
      {/* ========== HEADER DE NAVIGATION ========== */}
      <header className="
        sticky top-0 z-10 
        bg-[#FAFAFAF2] 
        backdrop-blur-md 
        border-b md:border-b-0 md:border-r
        border-[#3D3D3D0D] 
        px-3 md:px-4
        py-3 md:py-4
        shadow-soft
        md:w-48 lg:w-56
        md:flex-shrink-0
      ">
        {/* 
          Navigation responsive :
          MOBILE : date en haut, boutons côte à côte en bas
          DESKTOP (md+) : date en haut, boutons côte à côte en bas
        */}
        <div className="
          flex flex-col
          items-center md:items-start
          gap-3 md:gap-3
          mb-2 md:mb-4
        ">
          {/* Date actuelle - en haut */}
          <div className="w-full text-center md:text-left">
            <h2 className="
              text-base md:text-lg
              font-bold 
              text-[var(--color-brand-black)] 
              tracking-tight
              leading-tight
            ">
              {formatDateHeader(dayStart)}
            </h2>
            {isToday && (
              <p className="text-[10px] md:text-[10px] text-[#3D3D3D80] mt-0.5 font-medium">Aujourd'hui</p>
            )}
          </div>

          {/* Boutons de navigation - côte à côte en bas */}
          <div className="
            flex flex-row
            items-center
            justify-center md:justify-start
            gap-2 md:gap-2
            w-full
          ">
            {/* Bouton jour précédent */}
            <button
              onClick={goToPreviousDay}
              className="
                w-8 h-8 md:w-9 md:h-9
                rounded-full
                flex items-center justify-center
                bg-[var(--color-brand-white)] 
                border border-[#3D3D3D1A]
                hover:bg-[#CDE8FA4D]
                text-[var(--color-brand-black)]
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-brand-blue
                flex-shrink-0
              "
              aria-label="Jour précédent"
            >
              <svg
                className="w-4 h-4 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Bouton jour suivant */}
            <button
              onClick={goToNextDay}
              className="
                w-8 h-8 md:w-9 md:h-9
                rounded-full
                flex items-center justify-center
                bg-[var(--color-brand-white)] 
                border border-[#3D3D3D1A]
                hover:bg-[#CDE8FA4D]
                text-[var(--color-brand-black)]
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-brand-blue
                flex-shrink-0
              "
              aria-label="Jour suivant"
            >
              <svg
                className="w-4 h-4 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Bouton "Aujourd'hui" */}
        {!isToday && (
          <button
            onClick={goToToday}
            className="
              w-full 
              py-2 
              px-3 
              rounded-medium
              bg-gradient-green-blue
              text-[var(--color-brand-black)] 
              text-xs 
              md:text-xs
              font-bold
              transition-all duration-200 
              hover:opacity-90 
              hover:scale-[1.02]
              focus:outline-none 
              focus:ring-2 
              focus:ring-brand-blue/50
              shadow-soft
              mt-2 md:mt-2
            "
          >
            Aujourd'hui
          </button>
        )}
      </header>

      {/* ========== TIMELINE DES ÉVÉNEMENTS ========== */}
      <main className="
        flex-1 
        overflow-y-auto
        md:flex md:flex-col
      ">
        {/* 
          Layout responsive :
          MOBILE : timeline seule, pleine largeur
          DESKTOP (md+) : timeline à gauche, résumé des événements à droite (optionnel)
        */}
        <div className="
          flex flex-col md:flex-row
          h-full
        ">
          {/* Colonne principale : Timeline */}
          <div className="
            flex-1 
            relative 
            px-4 md:px-6 lg:px-8
            py-2 md:py-4
            min-h-0
          ">
            {/* Container principal avec timeline absolue */}
            <div className="relative" style={{ minHeight: `${24 * 60}px` }}>
              {/* Lignes horaires (pour le visuel) */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="
                    flex items-start
                    border-b border-[#3D3D3D1A]
                    absolute left-0 right-0
                  "
                  style={{
                    top: `${(hour / 24) * 100}%`,
                    height: `${(1 / 24) * 100}%`,
                    minHeight: "60px",
                  }}
                >
                  {/* Label de l'heure - plus large sur desktop */}
                  <div className="
                    w-16 md:w-20 lg:w-24
                    flex-shrink-0 
                    pt-2
                  ">
                    <span className="
                      text-xs md:text-sm
                      text-[#3D3D3D80] 
                      font-medium
                    ">
                      {formatHour(hour)}
                    </span>
                  </div>

                  {/* Zone des événements (vide, les événements sont positionnés absolument) */}
                  <div className="flex-1 relative pt-2 min-h-[60px]" />
                </div>
              ))}

              {/* Événements positionnés absolument dans la timeline */}
              <div className="
                absolute inset-0 
                left-16 md:left-20 lg:left-24
                right-0
              ">
              {dayEvents.map((event) => {
                const position = calculateEventPosition(event.start, dayStart);
                const height = calculateEventHeight(event.start, event.end, dayStart);
                
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    position={position}
                    height={height}
                  />
                );
              })}
              </div>
            </div>
          </div>

          {/* Colonne secondaire : Résumé des événements (desktop uniquement) */}
          {dayEvents.length > 0 && (
            <aside className="
              hidden md:flex
              md:flex-col
              md:w-64 lg:w-80
              md:border-l
              md:border-[#3D3D3D0D]
              md:px-4 lg:px-6
              md:py-4
              md:overflow-y-auto
              md:bg-[#FAFAFAF5]
            ">
              <h3 className="
                text-sm lg:text-base
                font-semibold
                text-[var(--color-brand-black)]
                mb-4
                sticky top-0
                bg-[#FAFAFAF5]
                pb-2
                border-b border-[#3D3D3D0D]
              ">
                {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""}
              </h3>
              <div className="flex flex-col gap-3">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="
                      p-3 lg:p-4
                      rounded-medium
                      bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                      border-none
                      shadow-soft
                      hover:shadow-medium
                      transition-all duration-200
                    "
                  >
                    <div className="
                      text-xs lg:text-sm
                      font-semibold
                      text-[#3D3D3DB3]
                      mb-1.5
                    ">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </div>
                    <div className="
                      text-sm lg:text-base
                      font-bold
                      text-[var(--color-brand-black)]
                      line-clamp-2
                    ">
                      {event.title}
                    </div>
                    {event.description && (
                      <div className="
                        text-xs lg:text-sm
                        text-[#3D3D3D80]
                        mt-2
                        line-clamp-2
                      ">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Composant EventCard
 * Affiche un événement dans la timeline
 */
interface EventCardProps {
  event: CalendarEvent;
  position: number;
  height: number;
}

function EventCard({ event, position, height }: EventCardProps) {
  // Dégradé vert → bleu pour tous les événements (identité visuelle unifiée)
  // On utilise la hauteur réelle calculée, avec seulement une hauteur minimale en pixels
  // pour garantir la lisibilité sans créer d'espaces visuels artificiels
  const finalHeight = height;

  return (
    <div
      className="
        absolute left-0 right-0
        bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
        border-none
        rounded-medium
        p-2.5 md:p-3
        text-[var(--color-brand-black)]
        shadow-soft
        hover:shadow-medium hover:scale-[1.02]
        transition-all duration-200
        cursor-pointer
        overflow-hidden
        flex flex-col
        gap-1
      "
      style={{
        top: `${Math.max(0, Math.min(100 - finalHeight, position))}%`,
        height: `${finalHeight}%`,
        minHeight: "30px", // Hauteur minimale en pixels uniquement (pas de % pour éviter les espaces)
      }}
      title={`${event.title} - ${formatTime(event.start)} - ${formatTime(event.end)}`}
    >
      {/* Heures de début et fin sur la même ligne */}
      <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-semibold text-[#3D3D3DB3] uppercase tracking-wide leading-none">
        <span>{formatTime(event.start)}</span>
        {height > 5 && (
          <span className="text-[#3D3D3D80] font-medium normal-case">
            Jusqu'à {formatTime(event.end)}
          </span>
        )}
      </div>
      
      {/* Titre */}
      <div className="text-xs md:text-sm font-bold text-[var(--color-brand-black)] line-clamp-2 leading-tight flex-1">
        {event.title}
      </div>
    </div>
  );
}

