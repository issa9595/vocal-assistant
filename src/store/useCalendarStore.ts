/**
 * @file useCalendarStore.ts
 * @description Store Zustand pour la gestion globale des évènements de calendrier.
 *
 * Gère :
 * - Les évènements (CRUD)
 * - Le mode de vue (jour / semaine / mois)
 * - La date de référence actuelle
 *
 * Persistance via localStorage.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent } from "@/types/message";
import {
  addHours,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithin,
} from "@/lib/dateHelpers";

type CalendarViewMode = "day" | "week" | "month" | "year";

/**
 * Représente un créneau libre dans le calendrier
 */
export interface FreeSlot {
  start: Date;
  end: Date;
  duration: number; // Durée en millisecondes
}

interface CalendarStore {
  events: CalendarEvent[];
  viewMode: CalendarViewMode;
  referenceDate: Date;
  isHydrated: boolean; // Indique si les données ont été chargées depuis Supabase

  // Méthodes pour les événements
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => string;
  // addEvents peut accepter des événements avec ou sans ID (pour les événements venant de Supabase)
  addEvents: (events: Array<Omit<CalendarEvent, "id" | "createdAt"> | CalendarEvent>) => string[];
  updateEvent: (eventId: string, updates: Partial<Omit<CalendarEvent, "id" | "createdAt">>) => void;
  deleteEvent: (eventId: string) => void;
  findEventByTitle: (title: string) => CalendarEvent | undefined;
  getEventsByGroupId: (groupId: string) => CalendarEvent[];

  // Méthodes pour l'hydratation depuis Supabase
  hydrateFromSupabase: () => Promise<void>;
  setEvents: (events: CalendarEvent[]) => void;

  // Méthodes pour trouver les créneaux libres
  findFreeSlots: (startDate: Date, endDate: Date, minDuration?: number) => FreeSlot[];
  canFitEvent: (start: Date, end: Date) => boolean;

  // Méthodes de vue
  setViewMode: (mode: CalendarViewMode) => void;
  setReferenceDate: (date: Date) => void;
  goToToday: () => void;

  // Méthodes de récupération
  getEventsForDay: (date: Date) => CalendarEvent[];
  getEventsForWeek: (date: Date) => CalendarEvent[];
  getEventsForMonth: (date: Date) => CalendarEvent[];
}

const generateEventId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const generateGroupId = () => `group_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const getDefaultEvents = (): CalendarEvent[] => {
  const now = new Date();
  const today9 = new Date(now); today9.setHours(9, 0, 0, 0);
  const today14 = new Date(now); today14.setHours(14, 0, 0, 0);
  const tomorrow11 = new Date(now); tomorrow11.setDate(now.getDate() + 1); tomorrow11.setHours(11, 0, 0, 0);
  const nextWeek10 = new Date(now); nextWeek10.setDate(now.getDate() + 4); nextWeek10.setHours(10, 0, 0, 0);

  return [
    {
      id: generateEventId(),
      title: "Réunion d'équipe",
      start: today9,
      end: addHours(today9, 1),
      createdAt: now,
      source: "manual",
      description: "Synchronisation hebdomadaire",
    },
    {
      id: generateEventId(),
      title: "Revue de code PR #42",
      start: today14,
      end: addHours(today14, 1),
      createdAt: now,
      source: "manual",
    },
    {
      id: generateEventId(),
      title: "Déjeuner avec Marc",
      start: tomorrow11,
      end: addHours(tomorrow11, 1),
      createdAt: now,
      source: "manual",
    },
    {
      id: generateEventId(),
      title: "Sprint planning",
      start: nextWeek10,
      end: addHours(nextWeek10, 2),
      createdAt: now,
      source: "manual",
      description: "Préparation du sprint 23",
    },
  ];
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      viewMode: "day", // Vue journalière par défaut
      referenceDate: new Date(),
      isHydrated: false,

      addEvent: (eventInput) => {
        const id = generateEventId();
        const start = new Date(eventInput.start);
        const end = eventInput.end ? new Date(eventInput.end) : addHours(start, 1);

        const newEvent: CalendarEvent = {
          ...eventInput,
          id,
          start,
          end,
          createdAt: new Date(),
        };

        set((state) => ({
          events: [...state.events, newEvent].sort(
            (a, b) => a.start.getTime() - b.start.getTime()
          ),
        }));

        // Synchroniser avec Supabase
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: [newEvent] }),
        }).catch((error) => {
          console.error("Erreur lors de la synchronisation avec Supabase:", error);
        });

        return id;
      },

      addEvents: (eventsInput) => {
        const ids: string[] = [];
        const newEvents: CalendarEvent[] = [];

        eventsInput.forEach((eventInput) => {
          // Si l'événement a déjà un ID (venant de Supabase), l'utiliser
          // Sinon, générer un nouvel ID (pour les événements créés localement)
          const hasId = "id" in eventInput && eventInput.id;
          const id = hasId ? eventInput.id : generateEventId();
          const start = new Date(eventInput.start);
          const end = eventInput.end ? new Date(eventInput.end) : addHours(start, 1);
          const createdAt = ("createdAt" in eventInput && eventInput.createdAt) 
            ? new Date(eventInput.createdAt) 
            : new Date();

          newEvents.push({
            ...eventInput,
            id,
            start,
            end,
            createdAt,
          } as CalendarEvent);
          ids.push(id);
        });

        set((state) => {
          // Filtrer les doublons (au cas où un événement serait déjà présent)
          const existingIds = new Set(state.events.map(e => e.id));
          const uniqueNewEvents = newEvents.filter(e => !existingIds.has(e.id));
          
          return {
            events: [...state.events, ...uniqueNewEvents].sort(
              (a, b) => a.start.getTime() - b.start.getTime()
            ),
          };
        });

        // Synchroniser avec Supabase seulement si les événements n'ont pas déjà été sauvegardés
        // (c'est-à-dire s'ils n'ont pas d'ID Supabase)
        const eventsToSync = newEvents.filter(e => !e.id.startsWith("evt_") || e.id.includes("_"));
        if (eventsToSync.length > 0) {
          fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              events: eventsToSync.map(e => ({
                title: e.title,
                start: e.start.toISOString(),
                end: e.end.toISOString(),
                description: e.description,
                location: e.location,
                source: e.source,
                meta: e.meta,
              }))
            }),
          }).catch((error) => {
            console.error("Erreur lors de la synchronisation avec Supabase:", error);
          });
        }

        return ids;
      },

      updateEvent: (eventId, updates) => {
        let updatedEvent: CalendarEvent | null = null;
        
        set((state) => {
          const updatedEvents = state.events
            .map((evt) => {
              if (evt.id !== eventId) return evt;
              const start = updates.start ? new Date(updates.start) : evt.start;
              const end = updates.end ? new Date(updates.end) : evt.end;
              updatedEvent = { ...evt, ...updates, start, end };
              return updatedEvent;
            })
            .sort((a, b) => a.start.getTime() - b.start.getTime());
          
          return { events: updatedEvents };
        });

        // Synchroniser avec Supabase
        if (updatedEvent) {
          fetch(`/api/events/${eventId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          }).catch((error) => {
            console.error("Erreur lors de la synchronisation avec Supabase:", error);
          });
        }
      },

      deleteEvent: (eventId) => {
        set((state) => ({
          events: state.events.filter((evt) => evt.id !== eventId),
        }));

        // Synchroniser avec Supabase
        fetch(`/api/events/${eventId}`, {
          method: "DELETE",
        }).catch((error) => {
          console.error("Erreur lors de la synchronisation avec Supabase:", error);
        });
      },

      findEventByTitle: (title) => {
        const normalized = title.toLowerCase().trim();
        return get().events.find((evt) =>
          evt.title.toLowerCase().includes(normalized)
        );
      },

      getEventsByGroupId: (groupId) => {
        return get().events.filter((evt) => evt.meta?.groupId === groupId);
      },

      // ========== MÉTHODES HYDRATATION SUPABASE ==========

      /**
       * Charge les événements depuis Supabase et hydrate le store
       */
      hydrateFromSupabase: async () => {
        if (get().isHydrated) {
          return; // Déjà hydraté
        }

        try {
          const response = await fetch("/api/events");
          if (!response.ok) {
            console.error("Erreur lors du chargement des événements depuis Supabase");
            // Fallback sur les événements par défaut si Supabase n'est pas configuré
            set({ events: getDefaultEvents(), isHydrated: true });
            return;
          }

          const data = await response.json();
          const events: CalendarEvent[] = data.events || [];

          set({
            events: events.length > 0 ? events : getDefaultEvents(),
            isHydrated: true,
          });
        } catch (error) {
          console.error("Erreur lors de l'hydratation depuis Supabase:", error);
          // Fallback sur les événements par défaut
          set({ events: getDefaultEvents(), isHydrated: true });
        }
      },

      /**
       * Définit directement les événements (utilisé pour l'hydratation)
       */
      setEvents: (events) => {
        set({
          events: events.sort((a, b) => a.start.getTime() - b.start.getTime()),
          isHydrated: true,
        });
      },

      // ========== MÉTHODES CRÉNEAUX LIBRES ==========

      /**
       * Trouve les créneaux libres entre startDate et endDate
       * @param startDate Date de début de la recherche
       * @param endDate Date de fin de la recherche
       * @param minDuration Durée minimale en millisecondes (optionnel)
       * @returns Liste des créneaux libres triés par date de début
       */
      findFreeSlots: (startDate, endDate, minDuration = 0) => {
        const events = get().events
          .filter((evt) => {
            // Garder uniquement les événements qui chevauchent la période
            return evt.start < endDate && evt.end > startDate;
          })
          .sort((a, b) => a.start.getTime() - b.start.getTime());

        const freeSlots: FreeSlot[] = [];
        let currentStart = new Date(startDate);

        for (const event of events) {
          // Si l'événement commence après le début du créneau actuel
          if (event.start > currentStart) {
            const duration = event.start.getTime() - currentStart.getTime();
            if (duration >= minDuration) {
              freeSlots.push({
                start: new Date(currentStart),
                end: new Date(event.start),
                duration,
              });
            }
          }
          // Mettre à jour le début du prochain créneau potentiel
          if (event.end > currentStart) {
            currentStart = new Date(event.end);
          }
        }

        // Vérifier s'il reste un créneau après le dernier événement
        if (currentStart < endDate) {
          const duration = endDate.getTime() - currentStart.getTime();
          if (duration >= minDuration) {
            freeSlots.push({
              start: new Date(currentStart),
              end: new Date(endDate),
              duration,
            });
          }
        }

        return freeSlots;
      },

      /**
       * Vérifie si un événement peut être placé dans le créneau [start, end]
       * sans chevaucher d'autres événements
       */
      canFitEvent: (start, end) => {
        const events = get().events;
        return !events.some(
          (evt) =>
            (evt.start < end && evt.end > start) ||
            (start < evt.end && end > evt.start)
        );
      },

      setViewMode: (mode) => set({ viewMode: mode }),
      setReferenceDate: (date) => set({ referenceDate: date }),
      goToToday: () => set({ referenceDate: new Date() }),

      getEventsForDay: (date) => {
        const start = startOfDay(date);
        const end = endOfDay(date);
        return get()
          .events.filter((evt) => isWithin(evt.start, start, end))
          .sort((a, b) => a.start.getTime() - b.start.getTime());
      },

      getEventsForWeek: (date) => {
        const start = startOfWeek(date);
        const end = endOfWeek(date);
        return get()
          .events.filter((evt) => isWithin(evt.start, start, end))
          .sort((a, b) => a.start.getTime() - b.start.getTime());
      },

      getEventsForMonth: (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        return get()
          .events.filter((evt) => isWithin(evt.start, start, end))
          .sort((a, b) => a.start.getTime() - b.start.getTime());
      },
    }),
    {
      name: "voice-planner-calendar",
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          
          // Fonction helper pour valider une date
          const isValidDate = (date: Date | string | undefined | null): boolean => {
            if (!date) return false;
            const d = date instanceof Date ? date : new Date(date);
            return !isNaN(d.getTime());
          };

          if (parsed.state?.events) {
            parsed.state.events = parsed.state.events
              .map((evt: CalendarEvent) => {
                const start = new Date(evt.start);
                const end = new Date(evt.end);
                const createdAt = new Date(evt.createdAt);
                
                // Filtrer les événements avec des dates invalides
                if (!isValidDate(start) || !isValidDate(end) || !isValidDate(createdAt)) {
                  return null;
                }
                
                return {
                  ...evt,
                  start,
                  end,
                  createdAt,
                };
              })
              .filter((evt: CalendarEvent | null) => evt !== null);
          }
          
          
          if (parsed.state?.referenceDate) {
            const refDate = new Date(parsed.state.referenceDate);
            parsed.state.referenceDate = isValidDate(refDate) ? refDate : new Date();
          }
          
          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

