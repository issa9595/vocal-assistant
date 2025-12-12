/**
 * @file CalendarView.tsx
 * @description Composant de calendrier (Jour / Semaine / Mois) connecté au store Zustand.
 *
 * Mobile-first, vue compacte avec sélecteur de vue.
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import type { CalendarEvent } from "@/types/message";

type CalendarViewMode = "day" | "week" | "month";

const viewLabels: Record<CalendarViewMode, string> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const formatMonth = (date: Date) =>
  date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

export function CalendarView() {
  // État pour détecter si on est côté client (après hydratation)
  // Évite les erreurs d'hydratation avec localStorage
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    viewMode,
    referenceDate,
    setViewMode,
    setReferenceDate,
    goToToday,
    getEventsForDay,
    getEventsForWeek,
    getEventsForMonth,
    hydrateFromSupabase,
    isHydrated,
  } = useCalendarStore();

  // Hydrater depuis Supabase au montage
  useEffect(() => {
    if (isMounted && !isHydrated) {
      hydrateFromSupabase();
    }
  }, [isMounted, isHydrated, hydrateFromSupabase]);

  const events = useMemo(() => {
    if (!isMounted) return [];
    switch (viewMode) {
      case "day":
        return getEventsForDay(referenceDate);
      case "week":
        return getEventsForWeek(referenceDate);
      case "month":
      default:
        return getEventsForMonth(referenceDate);
    }
  }, [isMounted, viewMode, referenceDate, getEventsForDay, getEventsForWeek, getEventsForMonth]);

  const title = useMemo(() => {
    if (viewMode === "month") return formatMonth(referenceDate);
    return formatDate(referenceDate);
  }, [viewMode, referenceDate]);

  const handlePrev = () => {
    const d = new Date(referenceDate);
    if (viewMode === "day") d.setDate(d.getDate() - 1);
    if (viewMode === "week") d.setDate(d.getDate() - 7);
    if (viewMode === "month") d.setMonth(d.getMonth() - 1);
    setReferenceDate(d);
  };

  const handleNext = () => {
    const d = new Date(referenceDate);
    if (viewMode === "day") d.setDate(d.getDate() + 1);
    if (viewMode === "week") d.setDate(d.getDate() + 7);
    if (viewMode === "month") d.setMonth(d.getMonth() + 1);
    setReferenceDate(d);
  };

  return (
    <section className="flex flex-col w-full" aria-label="Calendrier">
      {/* Header du calendrier */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 capitalize">
            {title}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {isMounted ? (
              <>
                {events.length} évènement{events.length > 1 ? "s" : ""}
              </>
            ) : (
              <>Chargement...</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="px-3 py-2 rounded-lg bg-zinc-800/70 text-zinc-200 hover:bg-zinc-800 active:scale-95 transition"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-2 rounded-lg bg-zinc-800/70 text-zinc-200 hover:bg-zinc-800 active:scale-95 transition"
          >
            Aujourd'hui
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 rounded-lg bg-zinc-800/70 text-zinc-200 hover:bg-zinc-800 active:scale-95 transition"
            aria-label="Suivant"
          >
            →
          </button>
        </div>
      </div>

      {/* Sélecteur de vue */}
      <div className="flex items-center gap-2 mb-4">
        {(Object.keys(viewLabels) as CalendarViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === mode
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
            }`}
            aria-pressed={viewMode === mode}
          >
            {viewLabels[mode]}
          </button>
        ))}
      </div>

      {/* Liste des évènements */}
      <div className="flex flex-col gap-2">
        {!isMounted ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <p className="text-sm">Chargement...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <svg
              className="w-12 h-12 mb-3 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V5m8 2V5m-9 4h10m-9 4h4m-8 5h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Aucun évènement</p>
            <p className="text-xs mt-1 text-center max-w-[220px]">
              Utilisez l'assistant vocal pour créer un évènement avec date et heure.
            </p>
          </div>
        ) : null}

        {isMounted && events.map((event) => (
          <CalendarEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const hasSameDay = start.toDateString() === end.toDateString();

  return (
    <div
      className="w-full p-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800/80 transition shadow-sm shadow-black/20"
      aria-label={`Évènement ${event.title}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-400">
            {formatTime(start)} - {formatTime(end)}
          </span>
          {event.source === "voice" && (
            <span className="px-2 py-0.5 text-[10px] rounded bg-violet-500/20 text-violet-300">
              vocal
            </span>
          )}
        </div>
        <span className="text-[11px] text-zinc-500">
          {hasSameDay ? "" : start.toLocaleDateString("fr-FR")}
        </span>
      </div>

      <h3 className="text-base font-semibold text-zinc-100 mt-1">{event.title}</h3>

      {event.description && (
        <p className="text-sm text-zinc-400 mt-1">{event.description}</p>
      )}

      {event.location && (
        <p className="text-xs text-zinc-500 mt-1">📍 {event.location}</p>
      )}
    </div>
  );
}

