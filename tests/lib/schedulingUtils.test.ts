import { describe, it, expect } from "vitest";
import { findFreeSlots, canFitEvent } from "@/lib/schedulingUtils";
import type { CalendarEvent } from "@/types/message";

const HOUR = 60 * 60 * 1000;

function makeEvent(id: string, start: Date, end: Date): CalendarEvent {
  return { id, title: `Event ${id}`, start, end, createdAt: new Date() };
}

// Journée de référence : 9h → 18h
const dayStart = new Date(2026, 3, 15, 9, 0);
const dayEnd = new Date(2026, 3, 15, 18, 0);

describe("findFreeSlots", () => {
  it("retourne toute la plage si aucun événement", () => {
    const slots = findFreeSlots([], dayStart, dayEnd);
    expect(slots).toHaveLength(1);
    expect(slots[0].start).toEqual(dayStart);
    expect(slots[0].end).toEqual(dayEnd);
    expect(slots[0].duration).toBe(9 * HOUR);
  });

  it("découpe la plage autour d'un événement au milieu", () => {
    const events = [
      makeEvent("1", new Date(2026, 3, 15, 12, 0), new Date(2026, 3, 15, 13, 0)),
    ];
    const slots = findFreeSlots(events, dayStart, dayEnd);
    expect(slots).toHaveLength(2);
    expect(slots[0].end).toEqual(events[0].start);
    expect(slots[1].start).toEqual(events[0].end);
  });

  it("ignore les événements hors plage", () => {
    const events = [
      makeEvent("1", new Date(2026, 3, 14, 12, 0), new Date(2026, 3, 14, 13, 0)),
    ];
    const slots = findFreeSlots(events, dayStart, dayEnd);
    expect(slots).toHaveLength(1);
  });

  it("gère les événements qui se chevauchent", () => {
    const events = [
      makeEvent("1", new Date(2026, 3, 15, 10, 0), new Date(2026, 3, 15, 12, 0)),
      makeEvent("2", new Date(2026, 3, 15, 11, 0), new Date(2026, 3, 15, 14, 0)),
    ];
    const slots = findFreeSlots(events, dayStart, dayEnd);
    expect(slots).toHaveLength(2);
    expect(slots[0].duration).toBe(1 * HOUR); // 9h → 10h
    expect(slots[1].start).toEqual(new Date(2026, 3, 15, 14, 0)); // 14h → 18h
  });

  it("filtre les créneaux plus courts que minDuration", () => {
    const events = [
      makeEvent("1", new Date(2026, 3, 15, 9, 30), new Date(2026, 3, 15, 17, 0)),
    ];
    // Créneaux libres : 30 min (9h-9h30) et 1h (17h-18h)
    const slots = findFreeSlots(events, dayStart, dayEnd, HOUR);
    expect(slots).toHaveLength(1);
    expect(slots[0].duration).toBe(1 * HOUR);
  });
});

describe("canFitEvent", () => {
  const events = [
    makeEvent("1", new Date(2026, 3, 15, 12, 0), new Date(2026, 3, 15, 13, 0)),
  ];

  it("accepte un créneau totalement libre", () => {
    expect(
      canFitEvent(events, new Date(2026, 3, 15, 14, 0), new Date(2026, 3, 15, 15, 0))
    ).toBe(true);
  });

  it("refuse un créneau en conflit", () => {
    expect(
      canFitEvent(events, new Date(2026, 3, 15, 12, 30), new Date(2026, 3, 15, 13, 30))
    ).toBe(false);
  });

  it("accepte un créneau adjacent (fin = début d'un événement)", () => {
    expect(
      canFitEvent(events, new Date(2026, 3, 15, 11, 0), new Date(2026, 3, 15, 12, 0))
    ).toBe(true);
  });
});
