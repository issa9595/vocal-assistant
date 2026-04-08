// src/lib/schedulingUtils.ts
import type { CalendarEvent } from "@/types/message";

export interface FreeSlot {
  start: Date;
  end: Date;
  duration: number; // ms
}

/**
 * Finds free slots between startDate and endDate that are not occupied by events.
 */
export function findFreeSlots(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date,
  minDuration = 0
): FreeSlot[] {
  const sorted = events
    .filter((evt) => evt.start < endDate && evt.end > startDate)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const freeSlots: FreeSlot[] = [];
  let currentStart = new Date(startDate);

  for (const event of sorted) {
    if (event.start > currentStart) {
      const duration = event.start.getTime() - currentStart.getTime();
      if (duration >= minDuration) {
        freeSlots.push({ start: new Date(currentStart), end: new Date(event.start), duration });
      }
    }
    if (event.end > currentStart) {
      currentStart = new Date(event.end);
    }
  }

  if (currentStart < endDate) {
    const duration = endDate.getTime() - currentStart.getTime();
    if (duration >= minDuration) {
      freeSlots.push({ start: new Date(currentStart), end: new Date(endDate), duration });
    }
  }

  return freeSlots;
}

/**
 * Returns true if no existing event overlaps [start, end].
 */
export function canFitEvent(events: CalendarEvent[], start: Date, end: Date): boolean {
  return !events.some((evt) => evt.start < end && evt.end > start);
}
